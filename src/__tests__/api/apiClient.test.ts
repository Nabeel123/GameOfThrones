import { describe, it, expect, vi, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/utils/mswServer'
import { apiFetch, ApiError } from '@/api/apiClient'
import { characterArraySchema } from '@/api/validation'
import { mockCharacters } from '@/utils/mockData'

const TEST_URL = 'https://thronesapi.com/api/v2/Characters'

describe('apiFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns parsed and validated data on success', async () => {
    const result = await apiFetch(TEST_URL, characterArraySchema)
    expect(result).toHaveLength(mockCharacters.length)
    expect(result[0]?.fullName).toBe('Eddard Stark')
  })

  it('throws ApiError with type "server" on non-2xx response', async () => {
    server.use(
      http.get(TEST_URL, () => {
        return new HttpResponse(null, { status: 500 })
      })
    )
    await expect(apiFetch(TEST_URL, characterArraySchema)).rejects.toMatchObject({
      type: 'server',
      status: 500,
    })
  })

  it('throws ApiError with type "server" on 404', async () => {
    server.use(
      http.get(TEST_URL, () => {
        return new HttpResponse(null, { status: 404 })
      })
    )
    await expect(apiFetch(TEST_URL, characterArraySchema)).rejects.toMatchObject({
      type: 'server',
      status: 404,
    })
  })

  it('throws ApiError with type "network" on network failure', async () => {
    server.use(
      http.get(TEST_URL, () => {
        return HttpResponse.error()
      })
    )
    await expect(apiFetch(TEST_URL, characterArraySchema)).rejects.toMatchObject({
      type: 'network',
    })
  })

  it('throws ApiError with type "validation" when response fails schema', async () => {
    server.use(
      http.get(TEST_URL, () => {
        return HttpResponse.json([{ id: 'not-a-number', firstName: 'Bad' }])
      })
    )
    await expect(apiFetch(TEST_URL, characterArraySchema)).rejects.toMatchObject({
      type: 'validation',
    })
  })

  it('throws ApiError with type "parse" when response is not valid JSON', async () => {
    server.use(
      http.get(TEST_URL, () => {
        return new HttpResponse('not-json', {
          headers: { 'Content-Type': 'application/json' },
        })
      })
    )
    await expect(apiFetch(TEST_URL, characterArraySchema)).rejects.toMatchObject({
      type: 'parse',
    })
  })

  it('ApiError is instanceof Error', async () => {
    server.use(http.get(TEST_URL, () => new HttpResponse(null, { status: 500 })))
    try {
      await apiFetch(TEST_URL, characterArraySchema)
    } catch (err) {
      expect(err).toBeInstanceOf(Error)
      expect(err).toBeInstanceOf(ApiError)
    }
  })

  it('throws ApiError with type "timeout" when request is aborted', async () => {
    server.use(
      http.get(TEST_URL, async () => {
        // Simulate abort by never responding — we'll trigger it via AbortController mock
        await new Promise(() => {}) // Never resolves
        return HttpResponse.json([])
      })
    )

    // Mock fetch to throw an AbortError immediately
    const originalFetch = global.fetch
    global.fetch = vi
      .fn()
      .mockRejectedValue(
        Object.assign(new DOMException('The operation was aborted', 'AbortError'), {})
      )

    try {
      await expect(apiFetch(TEST_URL, characterArraySchema)).rejects.toMatchObject({
        type: 'timeout',
      })
    } finally {
      global.fetch = originalFetch
    }
  })

  it('throws ApiError with type "validation" for non-ZodError schema parse failure', async () => {
    server.use(http.get(TEST_URL, () => HttpResponse.json([])))

    // Use a schema whose parse method throws a non-ZodError
    const badSchema = {
      parse: () => {
        throw new TypeError('unexpected type error')
      },
    }

    await expect(apiFetch(TEST_URL, badSchema as never)).rejects.toMatchObject({
      type: 'validation',
      message: 'Response validation failed',
    })
  })
})
