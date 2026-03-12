import { useMemo } from 'react'
import { useCharacters } from './useCharacters'
import { filterByFamily } from '@/utils/characterFilters'

export function useHouseMembers(family: string, excludeId: number) {
  const { characters, isLoading, isError } = useCharacters()

  const houseMembers = useMemo(
    () => filterByFamily(characters, family, { excludeId }),
    [characters, family, excludeId]
  )

  return { houseMembers, isLoading, isError }
}
