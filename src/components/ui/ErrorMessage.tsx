import styles from './ErrorMessage.module.css'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div role="alert" className={styles.wrapper}>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className={styles.retryButton}>
          Try Again
        </button>
      )}
    </div>
  )
}
