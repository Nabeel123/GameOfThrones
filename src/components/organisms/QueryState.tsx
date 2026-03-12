import { ErrorMessage } from '../atoms/ErrorMessage'
import { MESSAGES } from '@/config/messages'

interface QueryStateProps {
  isLoading: boolean
  isError: boolean
  error?: Error | null
  onRetry?: () => void
  errorMessage?: string
  loadingContent: React.ReactNode
  children: React.ReactNode
}

export function QueryState({
  isLoading,
  isError,
  error,
  onRetry,
  errorMessage,
  loadingContent,
  children,
}: QueryStateProps) {
  if (isError) {
    return (
      <ErrorMessage
        message={errorMessage ?? error?.message ?? MESSAGES.errors.fallback}
        onRetry={onRetry}
      />
    )
  }

  if (isLoading) {
    return <>{loadingContent}</>
  }

  return <>{children}</>
}
