import { apiFetch } from './apiClient'
import { characterArraySchema } from './validation'
import { CHARACTERS_ENDPOINT } from '@/utils/constants'
import type { Character } from '@/api/validation'

export async function getAllCharacters(): Promise<Character[]> {
  return apiFetch(CHARACTERS_ENDPOINT, characterArraySchema)
}
