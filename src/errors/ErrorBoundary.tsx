import { Component, type ReactNode, type ErrorInfo } from 'react'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary] Caught error:', error, errorInfo.componentStack)
    }
    // TODO: replace with real error reporter (Sentry/Datadog) before production
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <ErrorMessage
          message="Something went wrong. Please try again."
          onRetry={this.handleReset}
        />
      )
    }

    return this.props.children
  }
}
