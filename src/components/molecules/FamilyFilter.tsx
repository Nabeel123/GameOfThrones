import { Select } from './Select'
import { useFamilies } from '@/hooks/useFamilies'
import { ALL_FAMILIES_OPTION } from '@/utils/constants'

interface FamilyFilterProps {
  selectedFamily: string
  onFamilyChange: (family: string) => void
  label?: string
}

export function FamilyFilter({
  selectedFamily,
  onFamilyChange,
  label = 'Filter by House',
}: FamilyFilterProps) {
  const { families, familyCounts } = useFamilies()
  const options = [ALL_FAMILIES_OPTION, ...families]

  return (
    <Select
      id="family-filter"
      label={label}
      value={selectedFamily}
      options={options}
      onChange={onFamilyChange}
      optionCounts={familyCounts}
    />
  )
}
