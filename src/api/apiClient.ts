import type { ZodSchema } from 'zod'
import { ZodError } from 'zod'
import { QUERY_CONFIG } from '@/utils/constants'

type ApiErrorType = 'network' | 'timeout' | 'parse' | 'validation' | 'server'

export class ApiError extends Error {
  constructor(
    public readonly type: ApiErrorType,
    message: string,
    public readonly status?: number,
    public readonly cause?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(url: string, schema: ZodSchema<T>): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), QUERY_CONFIG.fetchTimeout)

  let response: Response
  try {
    response = await fetch(url, { signal: controller.signal })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('timeout', `Request timed out after ${QUERY_CONFIG.fetchTimeout}ms`, undefined, err)
    }
    throw new ApiError('network', 'Network request failed', undefined, err)
  } finally {
    clearTimeout(timeoutId)
  }

  if (!response.ok) {
    throw new ApiError('server', `Server responded with ${response.status}`, response.status)
  }

  let json: unknown
  try {
    json = await response.json()
  } catch (err) {
    throw new ApiError('parse', 'Failed to parse response as JSON', undefined, err)
  }

  try {
    return schema.parse(json)
  } catch (err) {
    const detail = err instanceof ZodError ? `: ${err.message}` : ''
    throw new ApiError('validation', `Response validation failed${detail}`, undefined, err)
  }
}
