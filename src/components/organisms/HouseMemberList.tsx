import { Link } from 'react-router-dom'
import { SafeImage } from '../atoms/SafeImage'
import { Skeleton } from '../atoms/Skeleton'
import { QueryState } from './QueryState'
import { useHouseMembers } from '@/hooks/useHouseMembers'
import { MESSAGES } from '@/config/messages'
import { UNKNOWN_FAMILY } from '@/config/ui'
import styles from './HouseMemberList.module.css'

interface HouseMemberListProps {
  family: string
  excludeId: number
}

export function HouseMemberList({ family, excludeId }: HouseMemberListProps) {
  const { houseMembers, isLoading, isError } = useHouseMembers(family, excludeId)
  const displayFamily = family || UNKNOWN_FAMILY

  const loadingContent = (
    <div className={styles.scrollContainer} role="status" aria-label="Loading house members">
      <div className={styles.memberList}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={`skeleton-${i}`} variant="rectangular" width={120} height={160} />
        ))}
      </div>
    </div>
  )

  const successContent =
    houseMembers.length === 0 ? (
      <p className={styles.empty}>{MESSAGES.empty.noHouseMembers}</p>
    ) : (
      <div className={styles.scrollContainer}>
        <nav aria-label={`Other members of ${displayFamily}`}>
          <ul className={styles.memberList}>
            {houseMembers.map(member => (
              <li key={member.id} className={styles.memberItem}>
                <Link
                  to={`/character/${member.id}`}
                  className={styles.memberCard}
                  aria-label={`View details for ${member.fullName}`}
                >
                  <SafeImage
                    src={member.imageUrl}
                    alt={member.fullName}
                    wrapperClassName={styles.memberImageWrapper}
                  />
                  <div className={styles.memberNameOverlay}>
                    <p className={styles.memberName}>{member.fullName}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    )

  return (
    <section className={styles.section} aria-label={`Members of ${displayFamily}`}>
      <h3 className={styles.heading}>
        Family — {displayFamily}
        {!isLoading && houseMembers.length > 0 && (
          <span className={styles.headingBadge}>{houseMembers.length + 1}</span>
        )}
      </h3>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        errorMessage={MESSAGES.errors.loadHouseMembers}
        loadingContent={loadingContent}
      >
        {successContent}
      </QueryState>
    </section>
  )
}
