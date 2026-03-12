import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useCharacters } from './useCharacters'
import { QUERY_KEYS } from '@/utils/constants'

export function useCharacter(id: number) {
  const queryClient = useQueryClient()

  const { characters: allCharacters, isLoading, isError, error } = useCharacters()

  const character = allCharacters?.find(c => c.id === id)
  const notFound = !isLoading && !isError && character === undefined

  // Populate the per-character cache key from the list cache (safe for prefetching)
  useEffect(() => {
    if (character) {
      queryClient.setQueryData(QUERY_KEYS.character(id), character)
    }
  }, [character, id, queryClient])

  return {
    character,
    isLoading,
    isError,
    error,
    notFound,
  }
}
