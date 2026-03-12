import { useQuery } from '@tanstack/react-query'
import { getAllCharacters } from '@/api/thronesApi'
import { QUERY_KEYS } from '@/utils/constants'
import type { Character } from '@/types/character'
import type { ApiError } from '@/api/apiClient'

export function useCharacters() {
  const { data, isLoading, isError, error, refetch } = useQuery<Character[], ApiError>({
    queryKey: QUERY_KEYS.characters,
    queryFn: getAllCharacters,
  })

  return { characters: data, isLoading, isError, error, refetch }
}
