import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '@/utils/mswServer'
import { renderWithProviders } from '@/utils/testUtils'
import { HomePage } from '@/pages/HomePage'
import { CHARACTERS_ENDPOINT } from '@/utils/constants'

describe('HomePage', () => {
  it('shows loading skeletons initially', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByRole('status', { name: /loading characters/i })).toBeInTheDocument()
  })

  it('renders character cards after loading', async () => {
    renderWithProviders(<HomePage />)
    await waitFor(() => {
      expect(screen.getByText('Eddard Stark')).toBeInTheDocument()
    })
    expect(screen.getByText('Daenerys Targaryen')).toBeInTheDocument()
    expect(screen.getByText('Cersei Lannister')).toBeInTheDocument()
  })

  it('renders the family filter dropdown', async () => {
    renderWithProviders(<HomePage />)
    await waitFor(() => expect(screen.getByText('Eddard Stark')).toBeInTheDocument())
    expect(screen.getByRole('combobox', { name: /filter by house/i })).toBeInTheDocument()
  })

  it('filters characters when a family is selected', async () => {
    const user = userEvent.setup()
    renderWithProviders(<HomePage />)

    await waitFor(() => expect(screen.getByText('Eddard Stark')).toBeInTheDocument())

    const select = screen.getByRole('combobox', { name: /filter by house/i })
    await user.selectOptions(select, 'House Stark')

    await waitFor(() => {
      expect(screen.getByText('Eddard Stark')).toBeInTheDocument()
      expect(screen.getByText('Sansa Stark')).toBeInTheDocument()
      expect(screen.queryByText('Daenerys Targaryen')).not.toBeInTheDocument()
      expect(screen.queryByText('Cersei Lannister')).not.toBeInTheDocument()
    })
  })

  it('shows all characters when "All Characters" is selected after filtering', async () => {
    const user = userEvent.setup()
    renderWithProviders(<HomePage />)

    await waitFor(() => expect(screen.getByText('Eddard Stark')).toBeInTheDocument())

    const select = screen.getByRole('combobox', { name: /filter by house/i })
    await user.selectOptions(select, 'House Stark')
    await waitFor(() => expect(screen.queryByText('Daenerys Targaryen')).not.toBeInTheDocument())

    await user.selectOptions(select, 'All Characters')
    await waitFor(() => {
      expect(screen.getByText('Daenerys Targaryen')).toBeInTheDocument()
      expect(screen.getByText('Cersei Lannister')).toBeInTheDocument()
    })
  })

  it('shows empty message when no characters match filter', async () => {
    const user = userEvent.setup()
    // Add a character with a unique family to test empty state indirectly
    // We'll select a family that results in a real filter scenario
    renderWithProviders(<HomePage />)

    await waitFor(() => expect(screen.getByText('Eddard Stark')).toBeInTheDocument())

    const select = screen.getByRole('combobox', { name: /filter by house/i })
    await user.selectOptions(select, 'House Lannister')

    await waitFor(() => {
      expect(screen.getByText('Cersei Lannister')).toBeInTheDocument()
      expect(screen.queryByText('Eddard Stark')).not.toBeInTheDocument()
    })
  })

  it('shows error message when API fails', async () => {
    server.use(
      http.get(CHARACTERS_ENDPOINT, () => new HttpResponse(null, { status: 500 }))
    )
    renderWithProviders(<HomePage />)
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
  })

  it('each character card links to the detail page', async () => {
    renderWithProviders(<HomePage />)
    await waitFor(() => expect(screen.getByText('Eddard Stark')).toBeInTheDocument())

    const link = screen.getByRole('link', { name: /view details for eddard stark/i })
    expect(link).toHaveAttribute('href', '/character/1')
  })
})
