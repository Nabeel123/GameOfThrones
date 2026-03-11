import { Select } from './ui/Select'
import { useFamilies } from '@/hooks/useFamilies'
import { ALL_FAMILIES_OPTION } from '@/utils/constants'
import styles from './FamilyFilter.module.css'

interface FamilyFilterProps {
  selectedFamily: string
  onFamilyChange: (family: string) => void
}

export function FamilyFilter({ selectedFamily, onFamilyChange }: FamilyFilterProps) {
  const { families } = useFamilies()
  const options = [ALL_FAMILIES_OPTION, ...families]

  return (
    <div className={styles.wrapper}>
      <Select
        id="family-filter"
        label="Filter by House"
        value={selectedFamily}
        options={options}
        onChange={onFamilyChange}
      />
    </div>
  )
}
