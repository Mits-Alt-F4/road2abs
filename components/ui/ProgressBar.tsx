import { cn } from '@/lib/utils/cn'

interface ProgressBarProps {
  value: number
  max: number
  variant?: 'accent' | 'lime' | 'warn' | 'danger'
  className?: string
  showLabel?: boolean
}

export function ProgressBar({ value, max, variant = 'accent', className, showLabel }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex-1 h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-300', {
            'bg-[var(--color-accent)]': variant === 'accent',
            'bg-[var(--color-positive)]': variant === 'lime',
            'bg-[var(--color-warn)]': variant === 'warn',
            'bg-[var(--color-danger)]': variant === 'danger',
          })}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs tabular-nums text-[var(--color-subtle)] w-8 text-right">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  )
}
