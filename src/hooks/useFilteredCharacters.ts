import { useMemo } from 'react'
import { useCharacters } from './useCharacters'
import { filterByFamily } from '@/utils/characterFilters'
import { ALL_FAMILIES_OPTION } from '@/config/ui'

export function useFilteredCharacters(selectedFamily: string) {
  const { characters, isLoading, isError, refetch } = useCharacters()

  const filteredCharacters = useMemo(
    () => filterByFamily(characters, selectedFamily, { allOption: ALL_FAMILIES_OPTION }),
    [characters, selectedFamily]
  )

  return { filteredCharacters, isLoading, isError, refetch }
}
