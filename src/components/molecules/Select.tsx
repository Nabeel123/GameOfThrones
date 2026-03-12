import { useRef, useState } from 'react'
import { useClickOutside } from '@/hooks/useClickOutside'
import { classNames } from '@/utils/classNames'
import styles from './Select.module.css'

interface SelectProps {
  id: string
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  className?: string
  optionCounts?: Record<string, number>
}

export function Select({
  id,
  label,
  value,
  options,
  onChange,
  className,
  optionCounts,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useClickOutside(wrapperRef, () => setIsOpen(false))

  function handleSelect(option: string) {
    onChange(option)
    setIsOpen(false)
  }

  return (
    <div ref={wrapperRef} className={classNames(styles.wrapper, className)}>
      <label id={`${id}-label`} className={styles.label}>
        {label}
      </label>
      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${id}-label`}
        className={styles.trigger}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <span className={styles.triggerText}>{value}</span>
        <svg
          className={classNames(styles.chevron, isOpen ? styles.chevronOpen : undefined)}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>
      {isOpen && (
        <ul role="listbox" aria-labelledby={`${id}-label`} className={styles.dropdown}>
          {options.map(option => (
            <li
              key={option}
              role="option"
              aria-selected={option === value}
              className={classNames(
                styles.option,
                option === value ? styles.optionSelected : undefined
              )}
              onClick={() => handleSelect(option)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') handleSelect(option)
              }}
              tabIndex={0}
            >
              <span>{option}</span>
              {optionCounts?.[option] != null && (
                <span className={styles.badge} aria-label={`${optionCounts[option]} members`}>
                  {optionCounts[option]}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
