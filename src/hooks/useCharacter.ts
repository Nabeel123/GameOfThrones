import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllCharacters } from '@/api/thronesApi'
import { QUERY_KEYS, QUERY_CONFIG } from '@/utils/constants'
import type { Character } from '@/types/character'
import type { ApiError } from '@/api/apiClient'

export function useCharacter(id: number) {
  const queryClient = useQueryClient()

  const {
    data: allCharacters,
    isLoading,
    isError,
    error,
  } = useQuery<Character[], ApiError>({
    queryKey: QUERY_KEYS.characters,
    queryFn: getAllCharacters,
    staleTime: QUERY_CONFIG.staleTime,
    gcTime: QUERY_CONFIG.gcTime,
  })

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
