import { describe, it, expect } from 'vitest'
import { parseCharacters, parseCharacter } from '@/api/validation'

const validCharacter = {
  id: 1,
  firstName: 'Eddard',
  lastName: 'Stark',
  fullName: 'Eddard Stark',
  title: 'Lord of Winterfell',
  family: 'House Stark',
  image: 'eddard-stark.jpg',
  imageUrl: 'https://thronesapi.com/assets/images/eddard-stark.jpg',
}

describe('parseCharacter', () => {
  it('parses a valid character successfully', () => {
    const result = parseCharacter(validCharacter)
    expect(result.id).toBe(1)
    expect(result.fullName).toBe('Eddard Stark')
    expect(result.family).toBe('House Stark')
  })

  it('strips unexpected extra fields', () => {
    const withExtra = { ...validCharacter, unknownField: 'should be stripped' }
    const result = parseCharacter(withExtra)
    expect('unknownField' in result).toBe(false)
  })

  it('throws when required fields are missing', () => {
    const { id: _id, ...withoutId } = validCharacter
    expect(() => parseCharacter(withoutId)).toThrow()
  })

  it('throws when id is not a number', () => {
    expect(() => parseCharacter({ ...validCharacter, id: 'not-a-number' })).toThrow()
  })

  it('rejects javascript: protocol in imageUrl (XSS vector)', () => {
    expect(() =>
      parseCharacter({ ...validCharacter, imageUrl: 'javascript:alert(1)' })
    ).toThrow()
  })

  it('rejects http: imageUrl (non-HTTPS)', () => {
    expect(() =>
      parseCharacter({ ...validCharacter, imageUrl: 'http://insecure.com/img.jpg' })
    ).toThrow()
  })

  it('accepts empty string for optional-like fields (family can be empty)', () => {
    const result = parseCharacter({ ...validCharacter, family: '' })
    expect(result.family).toBe('')
  })

  it('accepts empty string for title', () => {
    const result = parseCharacter({ ...validCharacter, title: '' })
    expect(result.title).toBe('')
  })
})

describe('parseCharacters', () => {
  it('parses an array of valid characters', () => {
    const result = parseCharacters([validCharacter])
    expect(result).toHaveLength(1)
    expect(result[0]?.fullName).toBe('Eddard Stark')
  })

  it('returns an empty array for empty input', () => {
    expect(parseCharacters([])).toEqual([])
  })

  it('throws if any character in the array is invalid', () => {
    expect(() => parseCharacters([validCharacter, { id: 'bad' }])).toThrow()
  })

  it('throws for non-array input', () => {
    expect(() => parseCharacters(null)).toThrow()
    expect(() => parseCharacters('not-array')).toThrow()
  })
})

describe('httpsUrlSchema (via parseCharacter)', () => {
  const base = {
    id: 1,
    firstName: 'A',
    lastName: 'B',
    fullName: 'A B',
    title: '',
    family: '',
    image: 'a.jpg',
  }

  it('rejects a malformed URL string that cannot be parsed', () => {
    expect(() => parseCharacter({ ...base, imageUrl: '://bad-url' })).toThrow()
  })

  it('accepts an empty imageUrl string', () => {
    const result = parseCharacter({ ...base, imageUrl: '' })
    expect(result.imageUrl).toBe('')
  })
})
