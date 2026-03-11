import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/utils/mswServer'
import { useFamilies } from '@/hooks/useFamilies'
import { createWrapper } from '@/utils/hookTestWrapper'
import { CHARACTERS_ENDPOINT, UNKNOWN_FAMILY } from '@/utils/constants'

describe('useFamilies', () => {
  it('returns unique family names sorted alphabetically', async () => {
    const { result } = renderHook(() => useFamilies(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    const families = result.current.families
    expect(families).toContain('House Stark')
    expect(families).toContain('House Targaryen')
    expect(families).toContain('House Lannister')
    // Should be unique - no duplicates
    expect(new Set(families).size).toBe(families.length)
  })

  it('returns families sorted alphabetically', async () => {
    const { result } = renderHook(() => useFamilies(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    const families = result.current.families
    const sorted = [...families].sort()
    expect(families).toEqual(sorted)
  })

  it('returns empty array while loading', () => {
    const { result } = renderHook(() => useFamilies(), { wrapper: createWrapper() })
    expect(result.current.families).toEqual([])
  })

  it('does not include duplicate families', async () => {
    const { result } = renderHook(() => useFamilies(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    // House Stark appears 3 times in mock data but only once in families
    const starkCount = result.current.families.filter(f => f === 'House Stark').length
    expect(starkCount).toBe(1)
  })

  it('uses UNKNOWN_FAMILY for characters with empty family', async () => {
    server.use(
      http.get(CHARACTERS_ENDPOINT, () =>
        HttpResponse.json([
          {
            id: 99,
            firstName: 'Mystery',
            lastName: 'Person',
            fullName: 'Mystery Person',
            title: '',
            family: '   ',
            image: 'mystery.jpg',
            imageUrl: 'https://thronesapi.com/assets/images/mystery.jpg',
          },
        ])
      )
    )
    const { result } = renderHook(() => useFamilies(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.families).toContain(UNKNOWN_FAMILY)
  })
})
