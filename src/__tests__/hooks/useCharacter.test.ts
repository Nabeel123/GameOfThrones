import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useCharacter } from '@/hooks/useCharacter'
import { mockCharacters } from '@/utils/mockData'
import { createWrapper } from '@/utils/hookTestWrapper'

describe('useCharacter', () => {
  it('returns a character by id after loading', async () => {
    const { result } = renderHook(() => useCharacter(1), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.character?.id).toBe(1)
    expect(result.current.character?.fullName).toBe('Eddard Stark')
  })

  it('returns undefined character for non-existent id', async () => {
    const { result } = renderHook(() => useCharacter(9999), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.character).toBeUndefined()
    expect(result.current.notFound).toBe(true)
  })

  it('returns loading true initially', () => {
    const { result } = renderHook(() => useCharacter(1), { wrapper: createWrapper() })
    expect(result.current.isLoading).toBe(true)
  })

  it('finds character from mocked data', async () => {
    const targetCharacter = mockCharacters[2]!
    const { result } = renderHook(() => useCharacter(targetCharacter.id), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.character?.fullName).toBe(targetCharacter.fullName)
  })
})
