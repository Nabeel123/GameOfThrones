import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/utils/mswServer'
import { getAllCharacters, getCharacterById } from '@/api/thronesApi'
import { mockCharacters } from '@/utils/mockData'
import { CHARACTERS_ENDPOINT } from '@/config/api'
import { ApiError } from '@/api/apiClient'

describe('getAllCharacters', () => {
  it('returns validated character array on success', async () => {
    const result = await getAllCharacters()
    expect(result).toHaveLength(mockCharacters.length)
    expect(result[0]?.fullName).toBe('Eddard Stark')
  })

  it('throws ApiError on server error', async () => {
    server.use(http.get(CHARACTERS_ENDPOINT, () => new HttpResponse(null, { status: 503 })))
    await expect(getAllCharacters()).rejects.toBeInstanceOf(ApiError)
  })

  it('throws ApiError with type "server" on 500', async () => {
    server.use(http.get(CHARACTERS_ENDPOINT, () => new HttpResponse(null, { status: 500 })))
    await expect(getAllCharacters()).rejects.toMatchObject({ type: 'server' })
  })
})

describe('getCharacterById', () => {
  it('returns character on success', async () => {
    const target = mockCharacters[0]!
    const result = await getCharacterById(target.id)
    expect(result).toEqual(target)
  })

  it('throws ApiError with status 404 when character not found', async () => {
    const err = await getCharacterById(9999).catch(e => e)
    expect(err).toBeInstanceOf(ApiError)
    expect((err as ApiError).status).toBe(404)
  })
})
