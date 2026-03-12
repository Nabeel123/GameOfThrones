import type { Character } from '@/api/validation'

export function filterByFamily(
  characters: Character[] | undefined,
  family: string,
  options?: { excludeId?: number; allOption?: string }
): Character[] {
  if (!characters) return []

  const showAll = options?.allOption && (family === options.allOption || !family)
  const excludeId = options?.excludeId
  const isHouseMembers = excludeId != null

  // House members with empty family: no other members to show
  if (isHouseMembers && !family) return []

  let result: Character[]
  if (showAll) {
    result = characters
  } else {
    result = characters.filter(c => c.family === family)
  }

  if (excludeId != null) {
    result = result.filter(c => c.id !== excludeId)
  }

  return result
}
