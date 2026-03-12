import { memo } from 'react'
import { Link } from 'react-router-dom'
import { SafeImage } from '../atoms/SafeImage'
import type { Character } from '@/types/character'
import styles from './CharacterCard.module.css'

interface CharacterCardProps {
  character: Character
}

function CharacterCardBase({ character }: CharacterCardProps) {
  return (
    <Link
      to={`/character/${character.id}`}
      className={styles.card}
      aria-label={`View details for ${character.fullName}`}
    >
      <SafeImage
        src={character.imageUrl}
        alt={character.fullName}
        wrapperClassName={styles.imageWrapper}
      />
      <div className={styles.overlay}>
        <p className={styles.name}>{character.fullName}</p>
        {character.family && <p className={styles.family}>{character.family}</p>}
      </div>
    </Link>
  )
}

// Default shallow comparison — re-renders if any character field changes
export const CharacterCard = memo(CharacterCardBase)
