import { CharacterCard } from '../molecules/CharacterCard'
import { Skeleton } from '../atoms/Skeleton'
import { QueryState } from './QueryState'
import { MESSAGES } from '@/config/messages'
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

const LoadingSkeleton = (
  <div className={styles.grid} role="status" aria-label="Loading characters" aria-busy="true">
    {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
      <Skeleton key={`skeleton-${i}`} variant="rectangular" className={styles.skeletonCard} />
    ))}
    <span className="sr-only">Loading characters...</span>
  </div>
)

export function CharacterGrid({
  characters,
  isLoading,
  isError,
  onRetry,
  errorMessage = MESSAGES.errors.loadCharacters,
}: CharacterGridProps) {
  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      errorMessage={errorMessage}
      loadingContent={LoadingSkeleton}
    >
      <section className={styles.section} aria-label="Characters list">
        {characters.length === 0 ? (
          <div className={styles.grid}>
            <p className={styles.empty}>{MESSAGES.empty.noCharactersForFamily}</p>
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
    </QueryState>
  )
}
