import { cn } from '@/lib/utils/cn'

interface MacroTagProps {
  label: string
  value: number | string
  unit?: string
  highlight?: boolean
  className?: string
}

export function MacroTag({ label, value, unit, highlight, className }: MacroTagProps) {
  return (
    <div className={cn('flex flex-col items-center gap-0.5', className)}>
      <span
        className={cn(
          'text-xl font-bold tabular-nums leading-none',
          highlight ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]'
        )}
      >
        {value}
        {unit && <span className="text-sm font-medium ml-0.5">{unit}</span>}
      </span>
      <span className="text-xs text-[var(--color-subtle)] font-medium uppercase tracking-wide">
        {label}
      </span>
    </div>
  )
}

export function MacroRow({
  calories,
  protein,
  carbs,
  fat,
  showCarbsFat = false,
  size = 'md',
}: {
  calories: number
  protein: number
  carbs?: number
  fat?: number
  showCarbsFat?: boolean
  size?: 'sm' | 'md' | 'lg'
}) {
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl'
  const labelSize = size === 'sm' ? 'text-[10px]' : 'text-xs'

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center">
        <span className={cn(textSize, 'font-bold tabular-nums text-[var(--color-text)]')}>
          {Math.round(calories)}
        </span>
        <span className={cn(labelSize, 'text-[var(--color-subtle)] uppercase tracking-wide font-medium')}>
          kcal
        </span>
      </div>
      <div className="w-px h-8 bg-[var(--color-border)]" />
      <div className="flex flex-col items-center">
        <span className={cn(textSize, 'font-bold tabular-nums text-[var(--color-accent)]')}>
          {Math.round(protein)}g
        </span>
        <span className={cn(labelSize, 'text-[var(--color-subtle)] uppercase tracking-wide font-medium')}>
          protein
        </span>
      </div>
      {showCarbsFat && carbs != null && (
        <>
          <div className="w-px h-8 bg-[var(--color-border)]" />
          <div className="flex flex-col items-center">
            <span className={cn(textSize, 'font-bold tabular-nums text-[var(--color-text)]')}>
              {Math.round(carbs)}g
            </span>
            <span className={cn(labelSize, 'text-[var(--color-subtle)] uppercase tracking-wide font-medium')}>
              carbs
            </span>
          </div>
        </>
      )}
      {showCarbsFat && fat != null && (
        <>
          <div className="w-px h-8 bg-[var(--color-border)]" />
          <div className="flex flex-col items-center">
            <span className={cn(textSize, 'font-bold tabular-nums text-[var(--color-text)]')}>
              {Math.round(fat)}g
            </span>
            <span className={cn(labelSize, 'text-[var(--color-subtle)] uppercase tracking-wide font-medium')}>
              fat
            </span>
          </div>
        </>
      )}
    </div>
  )
}
