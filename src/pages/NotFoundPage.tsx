import { Link } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>Character Not Found</h1>
        <p className={styles.message}>
          The character you seek has vanished from the Seven Kingdoms.
        </p>
        <Link to="/" className={styles.homeLink}>
          ← Return to the realm
        </Link>
      </div>
    </main>
  )
}
