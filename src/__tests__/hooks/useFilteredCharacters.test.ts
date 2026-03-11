import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useFilteredCharacters } from '@/hooks/useFilteredCharacters'
import { createWrapper } from '@/utils/hookTestWrapper'
import { ALL_FAMILIES_OPTION } from '@/utils/constants'

describe('useFilteredCharacters', () => {
  it('returns all characters when filter is ALL_FAMILIES_OPTION', async () => {
    const { result } = renderHook(() => useFilteredCharacters(ALL_FAMILIES_OPTION), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.filteredCharacters).toHaveLength(5)
  })

  it('returns all characters when filter is empty string', async () => {
    const { result } = renderHook(() => useFilteredCharacters(''), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.filteredCharacters).toHaveLength(5)
  })

  it('filters characters by exact family match', async () => {
    const { result } = renderHook(() => useFilteredCharacters('House Stark'), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    // Mock data has 3 Starks (Eddard, Sansa, Jon)
    expect(result.current.filteredCharacters).toHaveLength(3)
    expect(result.current.filteredCharacters.every(c => c.family === 'House Stark')).toBe(true)
  })

  it('returns empty array when no characters match the filter', async () => {
    const { result } = renderHook(() => useFilteredCharacters('House Baratheon'), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.filteredCharacters).toHaveLength(0)
  })

  it('returns empty array while loading', () => {
    const { result } = renderHook(() => useFilteredCharacters('House Stark'), {
      wrapper: createWrapper(),
    })
    expect(result.current.filteredCharacters).toEqual([])
  })
})
