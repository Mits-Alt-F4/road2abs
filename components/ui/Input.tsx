import { cn } from '@/lib/utils/cn'
import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  unit?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, unit, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-[var(--color-text)]">
            {label}
            {hint && <span className="ml-1.5 text-xs font-normal text-[var(--color-subtle)]">{hint}</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-12 px-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] font-medium placeholder:text-[var(--color-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all text-base',
              unit && 'pr-12',
              error && 'border-red-400 focus:ring-red-400',
              className
            )}
            {...props}
          />
          {unit && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--color-subtle)]">
              {unit}
            </span>
          )}
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    )
  }
)
Input.displayName = 'Input'
export default Input
