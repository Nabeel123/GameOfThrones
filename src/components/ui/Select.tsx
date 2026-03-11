import { useEffect, useRef, useState } from 'react'
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
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  function handleSelect(option: string) {
    onChange(option)
    setIsOpen(false)
  }

  return (
    <div ref={wrapperRef} className={[styles.wrapper, className].filter(Boolean).join(' ')}>
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
          className={[styles.chevron, isOpen ? styles.chevronOpen : ''].filter(Boolean).join(' ')}
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
        <ul
          role="listbox"
          aria-labelledby={`${id}-label`}
          className={styles.dropdown}
        >
          {options.map(option => (
            <li
              key={option}
              role="option"
              aria-selected={option === value}
              className={[styles.option, option === value ? styles.optionSelected : ''].filter(Boolean).join(' ')}
              onClick={() => handleSelect(option)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSelect(option) }}
              tabIndex={0}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
