import { useMemo } from 'react'
import { useCharacters } from './useCharacters'
import { UNKNOWN_FAMILY } from '@/utils/constants'

export function useFamilies() {
  const { characters, isLoading, isError } = useCharacters()

  const families = useMemo(() => {
    if (!characters) return []
    const familySet = new Set<string>()
    for (const character of characters) {
      const family = character.family.trim() || UNKNOWN_FAMILY
      familySet.add(family)
    }
    return Array.from(familySet).sort()
  }, [characters])

  return { families, isLoading, isError }
}
