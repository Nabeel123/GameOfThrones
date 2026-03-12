import { Skeleton } from './Skeleton'
import styles from './PageLoader.module.css'

export function PageLoader() {
  return (
    <div className={styles.wrapper} role="status" aria-label="Loading page">
      <div className={styles.content}>
        <Skeleton variant="rectangular" className={styles.skeleton} />
        <Skeleton variant="text" width="60%" height={24} />
        <Skeleton variant="text" width="80%" height={16} />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}
