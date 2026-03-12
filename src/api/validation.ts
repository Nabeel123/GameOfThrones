import { z } from 'zod'

const httpsUrlSchema = z.string().refine(
  val => {
    if (val === '') return true
    try {
      const url = new URL(val)
      return url.protocol === 'https:'
    } catch {
      return false
    }
  },
  { message: 'imageUrl must be a valid HTTPS URL' }
)

const characterSchema = z
  .object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    fullName: z.string(),
    title: z.string(),
    family: z.string(),
    image: z.string(),
    imageUrl: httpsUrlSchema,
  })
  .strip()

export type Character = z.infer<typeof characterSchema>

export const characterArraySchema = z.array(characterSchema)

export function parseCharacter(data: unknown): Character {
  return characterSchema.parse(data)
}

export function parseCharacters(data: unknown): Character[] {
  return characterArraySchema.parse(data)
}
