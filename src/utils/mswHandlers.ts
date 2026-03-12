import { http, HttpResponse } from 'msw'
import { CHARACTERS_ENDPOINT } from '@/config/api'
import { mockCharacters } from './mockData'

export const API_URL = CHARACTERS_ENDPOINT

export const handlers = [
  http.get(API_URL, () => {
    return HttpResponse.json(mockCharacters)
  }),
  http.get(`${API_URL}/:id`, ({ params }) => {
    const id = Number(params.id)
    const character = mockCharacters.find(c => c.id === id)
    if (!character) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(character)
  }),
]
