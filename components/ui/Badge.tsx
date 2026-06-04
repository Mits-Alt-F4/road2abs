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
          'bg-emerald-50 text-emerald-700': variant === 'green',
          'bg-orange-50 text-orange-700': variant === 'orange',
          'bg-stone-100 text-stone-600': variant === 'stone',
          'bg-lime-100 text-lime-700': variant === 'lime',
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
        classes[store] ?? 'bg-stone-100 text-stone-600'
      )}
    >
      {labels[store] ?? store}
    </span>
  )
}
