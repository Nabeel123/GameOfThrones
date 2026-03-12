const API_BASE_URL = 'https://thronesapi.com/api/v2'
export const CHARACTERS_ENDPOINT = `${API_BASE_URL}/Characters`

export function characterEndpoint(id: number): string {
  return `${CHARACTERS_ENDPOINT}/${id}`
}

export const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  retry: 2,
  fetchTimeout: 5000, // 5 seconds
}
