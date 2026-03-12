import { classNames } from '@/utils/classNames'
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
      className={classNames(styles.skeleton, styles[variant], className)}
      style={{ width, height }}
    />
  )
}
