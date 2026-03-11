import { useMemo } from 'react'
import { useCharacters } from './useCharacters'
import { ALL_FAMILIES_OPTION } from '@/utils/constants'
import type { Character } from '@/types/character'

export function useFilteredCharacters(selectedFamily: string) {
  const { characters, isLoading, isError, refetch } = useCharacters()

  const filteredCharacters = useMemo<Character[]>(() => {
    if (!characters) return []
    if (!selectedFamily || selectedFamily === ALL_FAMILIES_OPTION) return characters
    return characters.filter(c => c.family === selectedFamily)
  }, [characters, selectedFamily])

  return { filteredCharacters, isLoading, isError, refetch }
}
