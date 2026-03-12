import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/utils/mswServer'
import { useCharacters } from '@/hooks/useCharacters'
import { mockCharacters } from '@/utils/mockData'
import { CHARACTERS_ENDPOINT } from '@/utils/constants'
import { createWrapper } from '@/utils/testUtils'

describe('useCharacters', () => {
  it('returns loading state initially', () => {
    const { result } = renderHook(() => useCharacters(), { wrapper: createWrapper() })
    expect(result.current.isLoading).toBe(true)
    expect(result.current.characters).toBeUndefined()
  })

  it('returns character array on success', async () => {
    const { result } = renderHook(() => useCharacters(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.characters).toHaveLength(mockCharacters.length)
    expect(result.current.characters?.[0]?.fullName).toBe('Eddard Stark')
  })

  it('returns error state when API fails', async () => {
    server.use(
      http.get(CHARACTERS_ENDPOINT, () => new HttpResponse(null, { status: 500 }))
    )
    const { result } = renderHook(() => useCharacters(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeTruthy()
    expect(result.current.characters).toBeUndefined()
  })

  it('isError is false and characters are defined on success', async () => {
    const { result } = renderHook(() => useCharacters(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.isError).toBe(false)
    expect(result.current.characters).toBeDefined()
  })
})
