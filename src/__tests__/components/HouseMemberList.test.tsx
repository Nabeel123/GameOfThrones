import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/utils/mswServer'
import { renderWithProviders } from '@/utils/testUtils'
import { HouseMemberList } from '@/components/organisms/HouseMemberList'
import { CHARACTERS_ENDPOINT } from '@/utils/constants'

function renderList(family: string, excludeId: number) {
  return renderWithProviders(<HouseMemberList family={family} excludeId={excludeId} />)
}

describe('HouseMemberList', () => {
  it('shows loading skeleton initially', () => {
    renderList('House Stark', 1)
    expect(screen.getByRole('status', { name: /loading house members/i })).toBeInTheDocument()
  })

  it('renders house members after loading', async () => {
    renderList('House Stark', 1)
    await waitFor(() => expect(screen.getByText('Sansa Stark')).toBeInTheDocument())
    expect(screen.getByText('Jon Snow')).toBeInTheDocument()
  })

  it('shows empty message when no other members exist', async () => {
    renderList('House Targaryen', 3)
    await waitFor(() =>
      expect(screen.getByText(/no other known house members/i)).toBeInTheDocument()
    )
  })

  it('uses UNKNOWN_FAMILY label when family is empty', async () => {
    server.use(http.get(CHARACTERS_ENDPOINT, () => HttpResponse.json([])))
    renderList('', 99)
    await waitFor(() =>
      expect(screen.getByText(/no other known house members/i)).toBeInTheDocument()
    )
    expect(screen.getByText(/Family — Unknown/i)).toBeInTheDocument()
  })
})
