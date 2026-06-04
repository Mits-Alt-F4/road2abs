'use client'
import { cn } from '@/lib/utils/cn'

interface ChipProps {
  label: string
  selected?: boolean
  onClick?: () => void
  icon?: string
  className?: string
  disabled?: boolean
}

export function Chip({ label, selected, onClick, icon, className, disabled }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 select-none whitespace-nowrap',
        selected
          ? 'bg-[var(--color-accent)] text-white shadow-sm'
          : 'bg-[var(--color-surface)] text-[var(--color-muted)] border border-[var(--color-border)] hover:border-[var(--color-accent-light)] hover:text-[var(--color-accent)]',
        disabled && 'opacity-40 cursor-not-allowed',
        className
      )}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  )
}

interface ChipGroupProps<T extends string> {
  options: { value: T; label: string; icon?: string }[]
  value: T | null
  onChange: (value: T) => void
  className?: string
}

export function ChipGroup<T extends string>({ options, value, onChange, className }: ChipGroupProps<T>) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((opt) => (
        <Chip
          key={opt.value}
          label={opt.label}
          icon={opt.icon}
          selected={value === opt.value}
          onClick={() => onChange(opt.value)}
        />
      ))}
    </div>
  )
}
