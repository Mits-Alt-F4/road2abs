import { cn } from '@/lib/utils/cn'
import { type HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ padding = 'md', className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-sm',
        {
          '': padding === 'none',
          'p-3': padding === 'sm',
          'p-4': padding === 'md',
          'p-5': padding === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
