import { apiFetch } from './apiClient'
import { characterArraySchema, characterSchema } from './validation'
import { CHARACTERS_ENDPOINT, characterEndpoint } from '@/config/api'
import type { Character } from '@/api/validation'

export async function getAllCharacters(): Promise<Character[]> {
  return apiFetch(CHARACTERS_ENDPOINT, characterArraySchema)
}

export async function getCharacterById(id: number): Promise<Character> {
  return apiFetch(characterEndpoint(id), characterSchema)
}
