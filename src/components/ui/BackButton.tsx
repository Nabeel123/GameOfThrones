import { Link } from 'react-router-dom'
import styles from './BackButton.module.css'

export function BackButton() {
  return (
    <Link to="/" className={styles.button} aria-label="Back to all characters">
      <span className={styles.arrow} aria-hidden="true">
        ←
      </span>
      All Characters
    </Link>
  )
}
