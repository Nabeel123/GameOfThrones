import { useState } from 'react'
import { classNames } from '@/utils/classNames'
import styles from './SafeImage.module.css'

interface SafeImageProps {
  src: string
  alt: string
  className?: string
  wrapperClassName?: string
}

function isValidHttpsUrl(url: string): boolean {
  if (!url) return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function SafeImage({ src, alt, className, wrapperClassName }: SafeImageProps) {
  const [hasError, setHasError] = useState(false)
  const safeSrc = isValidHttpsUrl(src) ? src : ''
  const showFallback = hasError || !safeSrc

  return (
    <div className={classNames(styles.wrapper, wrapperClassName)}>
      {showFallback ? (
        <div className={styles.fallback} role="img" aria-label={alt}>
          <svg
            className={styles.fallbackIcon}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
      ) : (
        <img
          src={safeSrc}
          alt={alt}
          className={classNames(styles.img, className)}
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  )
}
