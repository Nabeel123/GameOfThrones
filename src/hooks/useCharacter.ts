import { useQuery } from '@tanstack/react-query'
import { getCharacterById } from '@/api/thronesApi'
import { QUERY_KEYS } from '@/config/queryKeys'

export function useCharacter(id: number) {
  const {
    data: character,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.character(id),
    queryFn: () => getCharacterById(id),
    enabled: !Number.isNaN(id) && Number.isInteger(id),
  })

  const notFound = !isLoading && character === undefined

  return {
    character,
    isLoading,
    isError,
    error,
    notFound,
    refetch,
  }
}
