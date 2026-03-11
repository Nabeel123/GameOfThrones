import { Link } from 'react-router-dom'
import styles from './PageHeader.module.css'

interface PageHeaderProps {
  children?: React.ReactNode
}

export function PageHeader({ children }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <Link to="/" className={styles.titleLink}>
          <h1 className={styles.title}>Game of Thrones</h1>
        </Link>
      </div>
      {children != null && <div className={styles.filterSlot}>{children}</div>}
    </header>
  )
}
