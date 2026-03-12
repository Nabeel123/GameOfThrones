export const QUERY_KEYS = {
  characters: ['characters'] as const,
  character: (id: number) => ['character', id] as const,
}
