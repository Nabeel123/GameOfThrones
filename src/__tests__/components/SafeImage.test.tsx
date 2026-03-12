import { describe, it, expect } from 'vitest'
import { screen, render, fireEvent } from '@testing-library/react'
import { SafeImage } from '@/components/atoms/SafeImage'

describe('SafeImage', () => {
  it('renders an img element for a valid https URL', () => {
    render(<SafeImage src="https://example.com/image.jpg" alt="Test image" />)
    const img = screen.getByRole('img', { name: 'Test image' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  it('renders fallback for an empty src', () => {
    render(<SafeImage src="" alt="Test image" />)
    // No img element with src; fallback div rendered
    expect(screen.queryByRole('img', { name: 'Test image' })).toBeInTheDocument()
    // The fallback has role="img" with aria-label
    const fallback = screen.getByRole('img', { name: 'Test image' })
    expect(fallback.tagName).not.toBe('IMG')
  })

  it('renders fallback for a non-https URL', () => {
    render(<SafeImage src="http://insecure.com/image.jpg" alt="Test image" />)
    const fallback = screen.getByRole('img', { name: 'Test image' })
    expect(fallback.tagName).not.toBe('IMG')
  })

  it('renders fallback for an invalid URL', () => {
    render(<SafeImage src="not-a-url" alt="Test image" />)
    const fallback = screen.getByRole('img', { name: 'Test image' })
    expect(fallback.tagName).not.toBe('IMG')
  })

  it('shows fallback when image load fails', () => {
    render(<SafeImage src="https://example.com/broken.jpg" alt="Broken image" />)
    const img = screen.getByRole('img', { name: 'Broken image' })
    // Simulate load error
    fireEvent.error(img)
    // After error, fallback div should appear
    const fallback = screen.getByRole('img', { name: 'Broken image' })
    expect(fallback.tagName).not.toBe('IMG')
  })

  it('applies wrapperClassName when provided', () => {
    const { container } = render(
      <SafeImage src="https://example.com/image.jpg" alt="Test" wrapperClassName="custom-class" />
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('applies className to img when provided', () => {
    render(<SafeImage src="https://example.com/image.jpg" alt="Test" className="img-class" />)
    const img = screen.getByRole('img', { name: 'Test' })
    expect(img).toHaveClass('img-class')
  })
})
