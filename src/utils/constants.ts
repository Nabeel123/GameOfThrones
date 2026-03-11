const API_BASE_URL = 'https://thronesapi.com/api/v2'
export const CHARACTERS_ENDPOINT = `${API_BASE_URL}/Characters`

export const QUERY_KEYS = {
  characters: ['characters'] as const,
  character: (id: number) => ['character', id] as const,
}

export const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  retry: 2,
  fetchTimeout: 5000, // 5 seconds
}

export const ALL_FAMILIES_OPTION = 'All Characters'
export const UNKNOWN_FAMILY = 'Unknown'

export const FALLBACK_IMAGE = '/fallback-character.svg'
