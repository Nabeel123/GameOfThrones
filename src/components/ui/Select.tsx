import styles from './Select.module.css'

interface SelectProps {
  id: string
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  className?: string
}

export function Select({ id, label, value, options, onChange, className }: SelectProps) {
  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={styles.select}
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
