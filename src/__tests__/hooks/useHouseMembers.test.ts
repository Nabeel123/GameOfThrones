import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useHouseMembers } from '@/hooks/useHouseMembers'
import { createWrapper } from '@/utils/hookTestWrapper'

describe('useHouseMembers', () => {
  it('returns house members excluding the current character', async () => {
    // House Stark has 3 members (ids 1, 2, 5) - excluding id 1 should return 2
    const { result } = renderHook(() => useHouseMembers('House Stark', 1), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.houseMembers).toHaveLength(2)
    expect(result.current.houseMembers.every(c => c.id !== 1)).toBe(true)
    expect(result.current.houseMembers.every(c => c.family === 'House Stark')).toBe(true)
  })

  it('returns empty array when character is the only member of their family', async () => {
    // House Targaryen has 1 member (id 3)
    const { result } = renderHook(() => useHouseMembers('House Targaryen', 3), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.houseMembers).toHaveLength(0)
  })

  it('returns empty array when family is empty string', async () => {
    const { result } = renderHook(() => useHouseMembers('', 1), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.houseMembers).toHaveLength(0)
  })

  it('returns empty array while loading', () => {
    const { result } = renderHook(() => useHouseMembers('House Stark', 1), {
      wrapper: createWrapper(),
    })
    expect(result.current.houseMembers).toEqual([])
  })
})
