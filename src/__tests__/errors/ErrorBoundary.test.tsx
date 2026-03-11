import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBoundary } from '@/errors/ErrorBoundary'

function BrokenComponent(): never {
  throw new Error('Test error')
}

function ChildComponent() {
  return <div>Child content</div>
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ChildComponent />
      </ErrorBoundary>
    )
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('renders default error UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    )
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('renders custom fallback when provided and child throws', () => {
    render(
      <ErrorBoundary fallback={<div>Custom fallback</div>}>
        <BrokenComponent />
      </ErrorBoundary>
    )
    expect(screen.getByText('Custom fallback')).toBeInTheDocument()
  })

  it('resets error state when "Try Again" button is clicked', async () => {
    const user = userEvent.setup()
    let shouldThrow = true

    function ConditionalThrow() {
      if (shouldThrow) throw new Error('Test error')
      return <div>Recovered</div>
    }

    render(
      <ErrorBoundary>
        <ConditionalThrow />
      </ErrorBoundary>
    )

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    shouldThrow = false
    const retryButton = screen.getByRole('button', { name: /try again/i })
    await user.click(retryButton)
    expect(screen.getByText('Recovered')).toBeInTheDocument()
  })
})
