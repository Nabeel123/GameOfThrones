import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/utils/mswServer'
import { renderWithProviders } from '@/utils/testUtils'
import { DetailPage } from '@/pages/DetailPage'
import { CHARACTERS_ENDPOINT } from '@/utils/constants'

const ROUTE_PATH = '/character/:id'

function renderDetailPage(id: number | string) {
  return renderWithProviders(<DetailPage />, {
    routerProps: { initialEntries: [`/character/${id}`] },
    routePath: ROUTE_PATH,
  })
}

describe('DetailPage', () => {
  it('renders the page without crashing', async () => {
    renderDetailPage(1)
    await waitFor(() => expect(screen.getByText('Eddard Stark')).toBeInTheDocument())
  })

  it('renders character details after loading', async () => {
    renderDetailPage(1)
    await waitFor(() => expect(screen.getByText('Eddard Stark')).toBeInTheDocument())
    expect(screen.getByText('Lord of Winterfell')).toBeInTheDocument()
    expect(screen.getByText('House Stark')).toBeInTheDocument()
  })

  it('renders first and last name fields', async () => {
    renderDetailPage(1)
    await waitFor(() => expect(screen.getByText('Eddard Stark')).toBeInTheDocument())
    expect(screen.getByText('Eddard')).toBeInTheDocument()
    expect(screen.getByText('Stark')).toBeInTheDocument()
  })

  it('renders house members section with other Stark members', async () => {
    renderDetailPage(1)
    await waitFor(() => expect(screen.getByText('Eddard Stark')).toBeInTheDocument())
    expect(screen.getByText('Sansa Stark')).toBeInTheDocument()
    expect(screen.getByText('Jon Snow')).toBeInTheDocument()
    expect(screen.getByText(/Family — House Stark/i)).toBeInTheDocument()
  })

  it('each house member card is a clickable link to their detail page', async () => {
    renderDetailPage(1)
    await waitFor(() => expect(screen.getByText('Sansa Stark')).toBeInTheDocument())
    const sansaLink = screen.getByRole('link', { name: /view details for sansa stark/i })
    expect(sansaLink).toHaveAttribute('href', '/character/2')
  })

  it('shows back button linking to home', async () => {
    renderDetailPage(1)
    await waitFor(() => expect(screen.getByText('Eddard Stark')).toBeInTheDocument())
    const backLink = screen.getByRole('link', { name: /back to all characters/i })
    expect(backLink).toHaveAttribute('href', '/')
  })

  it('shows "no other known house members" when character is the only house member', async () => {
    renderDetailPage(3) // Daenerys - only Targaryen in mock data
    await waitFor(() => expect(screen.getByText('Daenerys Targaryen')).toBeInTheDocument())
    expect(screen.getByText(/no other known house members/i)).toBeInTheDocument()
  })

  it('redirects to not-found page for a non-existent character id', async () => {
    renderDetailPage(9999)
    await waitFor(() => {
      expect(screen.getByText('Not Found')).toBeInTheDocument()
    })
  })

  it('redirects to not-found when id is not a number', async () => {
    renderDetailPage('abc')
    await waitFor(() => {
      expect(screen.getByText('Not Found')).toBeInTheDocument()
    })
  })

  it('shows error message when API call fails', async () => {
    server.use(
      http.get(CHARACTERS_ENDPOINT, () => new HttpResponse(null, { status: 500 }))
    )
    renderDetailPage(1)
    await waitFor(
      () => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })
})
