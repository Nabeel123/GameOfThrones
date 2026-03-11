import { describe, it, expect } from 'vitest'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { CharacterGrid } from '@/components/CharacterGrid'
import { mockCharacters } from '@/utils/mockData'

function renderGrid(props: React.ComponentProps<typeof CharacterGrid>) {
  return render(
    <MemoryRouter>
      <CharacterGrid {...props} />
    </MemoryRouter>
  )
}

describe('CharacterGrid', () => {
  it('renders character cards when data is available', () => {
    renderGrid({ characters: mockCharacters, isLoading: false, isError: false })
    expect(screen.getByText('Eddard Stark')).toBeInTheDocument()
    expect(screen.getByText('Sansa Stark')).toBeInTheDocument()
  })

  it('renders loading skeletons when isLoading is true', () => {
    renderGrid({ characters: [], isLoading: true, isError: false })
    expect(screen.getByRole('status', { name: /loading characters/i })).toBeInTheDocument()
  })

  it('renders error message when isError is true', () => {
    renderGrid({ characters: [], isLoading: false, isError: true })
    expect(screen.getByText(/failed to load characters/i)).toBeInTheDocument()
  })

  it('renders empty state when no characters match', () => {
    renderGrid({ characters: [], isLoading: false, isError: false })
    expect(screen.getByText(/no characters found for this house/i)).toBeInTheDocument()
  })

  it('calls onRetry when "Try Again" button is clicked on error', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    renderGrid({ characters: [], isLoading: false, isError: true, onRetry })
    const retryButton = screen.getByRole('button', { name: /try again/i })
    await user.click(retryButton)
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
