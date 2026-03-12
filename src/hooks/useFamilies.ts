import { useMemo } from 'react'
import { useCharacters } from './useCharacters'
import { UNKNOWN_FAMILY } from '@/utils/constants'

export function useFamilies() {
  const { characters, isLoading, isError } = useCharacters()

  const { families, familyCounts } = useMemo(() => {
    if (!characters) return { families: [], familyCounts: {} as Record<string, number> }
    const counts: Record<string, number> = {}
    for (const character of characters) {
      const family = character.family.trim() || UNKNOWN_FAMILY
      counts[family] = (counts[family] ?? 0) + 1
    }
    return {
      families: Object.keys(counts).sort(),
      familyCounts: counts,
    }
  }, [characters])

  return { families, familyCounts, isLoading, isError }
}
