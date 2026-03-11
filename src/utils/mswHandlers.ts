import { http, HttpResponse } from 'msw'
import { mockCharacters } from './mockData'

export const API_URL = 'https://thronesapi.com/api/v2/Characters'

export const handlers = [
  http.get(API_URL, () => {
    return HttpResponse.json(mockCharacters)
  }),
]
