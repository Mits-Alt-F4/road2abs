import { cn } from '@/lib/utils/cn'

interface BadgeProps {
  label: string
  variant?: 'accent' | 'green' | 'orange' | 'stone' | 'lime'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ label, variant = 'stone', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold',
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
        {
          'bg-[var(--color-accent-light)] text-[var(--color-accent-dark)]': variant === 'accent',
          'bg-[#0d2a0d] text-[#4ade80]': variant === 'green',
          'bg-[#2a1200] text-[#fb923c]': variant === 'orange',
          'bg-[var(--color-surface-raised)] text-[var(--color-muted)]': variant === 'stone',
          'bg-[#1e2800] text-[var(--color-lime)]': variant === 'lime',
        },
        className
      )}
    >
      {label}
    </span>
  )
}

export function StoreBadge({ store }: { store: string }) {
  const classes: Record<string, string> = {
    coop: 'store-badge-coop',
    migros: 'store-badge-migros',
    lidl: 'store-badge-lidl',
    denner: 'store-badge-denner',
  }
  const labels: Record<string, string> = {
    coop: 'Coop',
    migros: 'Migros',
    lidl: 'Lidl',
    denner: 'Denner',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full text-[11px] font-bold px-2 py-0.5',
        classes[store] ?? 'bg-[var(--color-surface-raised)] text-[var(--color-muted)]'
      )}
    >
      {labels[store] ?? store}
    </span>
  )
}
