import styles from './Skeleton.module.css'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  variant?: 'text' | 'rectangular' | 'circular'
  className?: string
}

export function Skeleton({
  width = '100%',
  height = 16,
  variant = 'rectangular',
  className,
}: SkeletonProps) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={[styles.skeleton, styles[variant], className].filter(Boolean).join(' ')}
      style={{ width, height }}
    />
  )
}
