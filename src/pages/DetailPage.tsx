import { useParams, Navigate } from 'react-router-dom'
import { PageHeader } from '@/components/organisms/PageHeader'
import { CharacterDetail } from '@/components/organisms/CharacterDetail'
import { HouseMemberList } from '@/components/organisms/HouseMemberList'
import { BackButton } from '@/components/atoms/BackButton'
import { Skeleton } from '@/components/atoms/Skeleton'
import { ErrorMessage } from '@/components/atoms/ErrorMessage'
import { useCharacter } from '@/hooks/useCharacter'
import styles from './DetailPage.module.css'

function DetailPageSkeleton() {
  return (
    <div className={styles.skeletonDetail} role="status" aria-label="Loading character details">
      <Skeleton variant="rectangular" className={styles.skeletonImage} />
      <div className={styles.skeletonInfo}>
        <Skeleton variant="text" width="60%" height={36} />
        <Skeleton variant="text" width="80%" height={20} />
        <Skeleton variant="text" width="70%" height={20} />
        <Skeleton variant="text" width="50%" height={20} />
        <Skeleton variant="text" width="65%" height={20} />
      </div>
      <span className="sr-only">Loading character details...</span>
    </div>
  )
}

export function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const characterId = id && /^\d+$/.test(id) ? parseInt(id, 10) : NaN

  if (isNaN(characterId)) {
    return <Navigate to="/not-found" replace />
  }

  return <DetailPageContent characterId={characterId} />
}

function DetailPageContent({ characterId }: { characterId: number }) {
  const { character, isLoading, isError, notFound, error } = useCharacter(characterId)

  if (notFound) {
    return <Navigate to="/not-found" replace />
  }

  return (
    <div className={styles.page}>
      <PageHeader />

      <main className={styles.main} id="main-content">
        <div className={styles.nav}>
          <BackButton />
        </div>

        <div className={styles.content}>
          {isError && (
            <ErrorMessage message={error?.message ?? 'Failed to load character details.'} />
          )}

          {isLoading && <DetailPageSkeleton />}

          {character && (
            <>
              <CharacterDetail character={character} />
              <HouseMemberList family={character.family} excludeId={character.id} />
            </>
          )}
        </div>
      </main>
    </div>
  )
}
