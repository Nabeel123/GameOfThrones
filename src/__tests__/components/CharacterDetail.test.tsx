import { describe, it, expect } from 'vitest'
import { screen, render } from '@testing-library/react'
import { CharacterDetail } from '@/components/organisms/CharacterDetail'
import type { Character } from '@/types/character'

const mockCharacter: Character = {
  id: 1,
  firstName: 'Eddard',
  lastName: 'Stark',
  fullName: 'Eddard Stark',
  title: 'Lord of Winterfell',
  family: 'House Stark',
  image: 'eddard-stark.jpg',
  imageUrl: 'https://thronesapi.com/assets/images/eddard-stark.jpg',
}

describe('CharacterDetail', () => {
  it('renders character full name', () => {
    render(<CharacterDetail character={mockCharacter} />)
    expect(screen.getByRole('heading', { name: 'Eddard Stark' })).toBeInTheDocument()
  })

  it('renders character info rows', () => {
    render(<CharacterDetail character={mockCharacter} />)
    expect(screen.getByText('Eddard')).toBeInTheDocument()
    expect(screen.getByText('Stark')).toBeInTheDocument()
    expect(screen.getByText('Lord of Winterfell')).toBeInTheDocument()
    expect(screen.getByText('House Stark')).toBeInTheDocument()
  })

  it('displays "Unknown" for family when family is empty string', () => {
    const noFamily = { ...mockCharacter, family: '' }
    render(<CharacterDetail character={noFamily} />)
    expect(screen.getByText('Unknown')).toBeInTheDocument()
  })
})
