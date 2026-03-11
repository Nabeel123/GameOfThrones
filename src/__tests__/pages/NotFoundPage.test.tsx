import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/utils/testUtils'
import { NotFoundPage } from '@/pages/NotFoundPage'

describe('NotFoundPage', () => {
  it('renders the not found heading', () => {
    renderWithProviders(<NotFoundPage />)
    expect(screen.getByRole('heading', { name: /character not found/i })).toBeInTheDocument()
  })

  it('renders the descriptive message', () => {
    renderWithProviders(<NotFoundPage />)
    expect(screen.getByText(/vanished from the seven kingdoms/i)).toBeInTheDocument()
  })

  it('renders a link back to home', () => {
    renderWithProviders(<NotFoundPage />)
    const link = screen.getByRole('link', { name: /return to the realm/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })
})
