import { SafeImage } from '../atoms/SafeImage'
import type { Character } from '@/types/character'
import styles from './CharacterDetail.module.css'

interface CharacterDetailProps {
  character: Character
}

interface InfoRowProps {
  label: string
  value: string
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className={styles.infoRow}>
      <dt className={styles.infoLabel}>{label}</dt>
      <dd className={styles.infoValue}>{value}</dd>
    </div>
  )
}

export function CharacterDetail({ character }: CharacterDetailProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.imageWrapper}>
        <SafeImage src={character.imageUrl} alt={`Portrait of ${character.fullName}`} />
      </div>

      <div className={styles.info}>
        <h2 className={styles.fullName}>{character.fullName}</h2>
        <dl className={styles.infoTable}>
          <InfoRow label="First Name" value={character.firstName} />
          <InfoRow label="Last Name" value={character.lastName} />
          <InfoRow label="Title" value={character.title} />
          <InfoRow label="Family" value={character.family || 'Unknown'} />
        </dl>
      </div>
    </div>
  )
}
