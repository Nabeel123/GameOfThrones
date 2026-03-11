import { Link } from 'react-router-dom'
import { SafeImage } from './ui/SafeImage'
import { Skeleton } from './ui/Skeleton'
import { useHouseMembers } from '@/hooks/useHouseMembers'
import { UNKNOWN_FAMILY } from '@/utils/constants'
import styles from './HouseMemberList.module.css'

interface HouseMemberListProps {
  family: string
  excludeId: number
}

export function HouseMemberList({ family, excludeId }: HouseMemberListProps) {
  const { houseMembers, isLoading } = useHouseMembers(family, excludeId)
  const displayFamily = family || UNKNOWN_FAMILY

  return (
    <section className={styles.section} aria-label={`Members of ${displayFamily}`}>
      <h3 className={styles.heading}>Family — {displayFamily}</h3>

      {isLoading ? (
        <div className={styles.scrollContainer} role="status" aria-label="Loading house members">
          <div className={styles.memberList}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" width={120} height={160} />
            ))}
          </div>
        </div>
      ) : houseMembers.length === 0 ? (
        <p className={styles.empty}>No other known house members.</p>
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
      )}
    </section>
  )
}
