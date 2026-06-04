'use client'
import { cn } from '@/lib/utils/cn'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'lime'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-semibold rounded-[var(--radius-lg)] transition-all duration-150 select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]',
          {
            'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)] shadow-sm':
              variant === 'primary',
            'bg-[var(--color-lime)] text-[#0e0e0e] hover:bg-[var(--color-lime-300)] shadow-sm font-bold':
              variant === 'lime',
            'bg-[var(--color-surface-raised)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-border)]':
              variant === 'secondary',
            'bg-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]':
              variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
          },
          {
            'text-sm px-3 py-2 h-9': size === 'sm',
            'text-sm px-4 py-2.5 h-10': size === 'md',
            'text-base px-5 py-3 h-12': size === 'lg',
            'text-base px-6 py-4 h-14 text-lg font-bold': size === 'xl',
          },
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
export default Button
