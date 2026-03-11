import { CharacterCard } from './CharacterCard'
import { Skeleton } from './ui/Skeleton'
import { ErrorMessage } from './ui/ErrorMessage'
import type { Character } from '@/types/character'
import styles from './CharacterGrid.module.css'

interface CharacterGridProps {
  characters: Character[]
  isLoading: boolean
  isError: boolean
  onRetry?: () => void
}

const SKELETON_COUNT = 12

export function CharacterGrid({ characters, isLoading, isError, onRetry }: CharacterGridProps) {
  if (isError) {
    return (
      <ErrorMessage
        message="Failed to load characters. Please check your connection and try again."
        onRetry={onRetry}
      />
    )
  }

  if (isLoading) {
    return (
      <div
        className={styles.skeletonGrid}
        role="status"
        aria-label="Loading characters"
        aria-busy="true"
      >
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
