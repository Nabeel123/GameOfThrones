import { useQuery } from '@tanstack/react-query'
import { getAllCharacters } from '@/api/thronesApi'
import { QUERY_KEYS, QUERY_CONFIG } from '@/utils/constants'
import type { Character } from '@/types/character'
import type { ApiError } from '@/api/apiClient'

export function useCharacters() {
  const { data, isLoading, isError, error, refetch } = useQuery<Character[], ApiError>({
    queryKey: QUERY_KEYS.characters,
    queryFn: getAllCharacters,
    staleTime: QUERY_CONFIG.staleTime,
    gcTime: QUERY_CONFIG.gcTime,
  })

  return {
    characters: data,
    isLoading,
    isError,
    error,
    refetch,
  }
}
