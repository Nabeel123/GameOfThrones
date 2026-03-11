import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { FamilyFilter } from '@/components/FamilyFilter'
import { CharacterGrid } from '@/components/CharacterGrid'
import { ErrorBoundary } from '@/errors/ErrorBoundary'
import { useFilteredCharacters } from '@/hooks/useFilteredCharacters'
import { ALL_FAMILIES_OPTION } from '@/utils/constants'
import styles from './HomePage.module.css'

export function HomePage() {
  const [selectedFamily, setSelectedFamily] = useState(ALL_FAMILIES_OPTION)
  const { filteredCharacters, isLoading, isError, refetch } = useFilteredCharacters(selectedFamily)

  return (
    <div className={styles.page}>
      <PageHeader>
        <FamilyFilter selectedFamily={selectedFamily} onFamilyChange={setSelectedFamily} />
      </PageHeader>

      <main className={styles.main} id="main-content">
        <ErrorBoundary>
          <CharacterGrid
            characters={filteredCharacters}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
          />
        </ErrorBoundary>
      </main>
    </div>
  )
}
