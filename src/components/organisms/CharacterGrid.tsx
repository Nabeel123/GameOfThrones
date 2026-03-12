import { CharacterCard } from '../molecules/CharacterCard'
import { Skeleton } from '../atoms/Skeleton'
import { ErrorMessage } from '../atoms/ErrorMessage'
import type { Character } from '@/api/validation'
import styles from './CharacterGrid.module.css'

interface CharacterGridProps {
  characters: Character[]
  isLoading: boolean
  isError: boolean
  onRetry?: () => void
  errorMessage?: string
}

const SKELETON_COUNT = 12
const DEFAULT_ERROR_MESSAGE =
  'Failed to load characters. Please check your connection and try again.'

export function CharacterGrid({
  characters,
  isLoading,
  isError,
  onRetry,
  errorMessage = DEFAULT_ERROR_MESSAGE,
}: CharacterGridProps) {
  if (isError) {
    return <ErrorMessage message={errorMessage} onRetry={onRetry} />
  }

  if (isLoading) {
    return (
      <div className={styles.grid} role="status" aria-label="Loading characters" aria-busy="true">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" className={styles.skeletonCard} />
        ))}
        <span className="sr-only">Loading characters...</span>
      </div>
    )
  }

  return (
    <section className={styles.section} aria-label="Characters list">
      {characters.length === 0 ? (
        <div className={styles.grid}>
          <p className={styles.empty}>No characters found for this house.</p>
        </div>
      ) : (
        <ul className={styles.grid}>
          {characters.map(character => (
            <li key={character.id}>
              <CharacterCard character={character} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
