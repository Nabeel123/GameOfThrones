import { useMemo } from 'react'
import { useCharacters } from './useCharacters'
import type { Character } from '@/types/character'

export function useHouseMembers(family: string, excludeId: number) {
  const { characters, isLoading, isError } = useCharacters()

  const houseMembers = useMemo<Character[]>(() => {
    if (!characters || !family) return []
    return characters.filter(c => c.family === family && c.id !== excludeId)
  }, [characters, family, excludeId])

  return { houseMembers, isLoading, isError }
}
