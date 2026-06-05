'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { StoreBadge } from '@/components/ui/Badge'
import { chf } from '@/lib/utils/format'
import type { MacroInput, RecommendationResult } from '@/types'

interface Props {
  results: RecommendationResult[]
  overBudgetResults: RecommendationResult[]
  remaining: MacroInput
  budget: number
  calorieBand: string
}

const bandLabel: Record<string, { text: string; color: string }> = {
  emergency: { text: 'Under 300 kcal — snacks & emergency protein only', color: 'text-[var(--color-warn)]' },
  light:     { text: '300–600 kcal — light meals and snacks', color: 'text-[var(--color-lime)]' },
  medium:    { text: '600–900 kcal — normal meals', color: 'text-[var(--color-lime)]' },
  large:     { text: '900+ kcal — full meals shown', color: 'text-[var(--color-lime)]' },
}

export default function DemoResultsClient({ results, overBudgetResults, remaining, budget, calorieBand }: Props) {
  const router = useRouter()
  const band = bandLabel[calorieBand] ?? { text: '', color: '' }

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">

      {/* Demo banner */}
      <div className="bg-[#1e2800] border-b border-[var(--color-lime)]/30 px-4 py-2 text-center">
        <p className="text-xs font-bold text-[var(--color-lime)]">
          Demo mode — sample data only ·{' '}
          <Link href="/demo/today" className="underline">← Back to form</Link>
        </p>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] font-bold text-sm">←</button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-black text-[var(--color-text)]">
            {results.length > 0 ? `${results.length} option${results.length !== 1 ? 's' : ''} found` : 'No matches'}
          </h1>
          <p className="text-xs text-[var(--color-subtle)] truncate">
            {Math.round(remaining.calories ?? 0)} kcal · {Math.round(remaining.protein ?? 0)}g protein · {chf(budget)}
          </p>
        </div>
      </header>

      {/* Band label */}
      <div className="px-4 pt-3">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] px-3 py-2 flex items-center justify-between gap-2">
          <p className={`text-xs font-bold ${band.color}`}>{band.text}</p>
          <Link
            href="/demo/today"
            className="text-[10px] font-semibold text-[var(--color-muted)] underline whitespace-nowrap flex-shrink-0"
          >
            Try 300 kcal ↔ 2000 kcal
          </Link>
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-3">
        {results.length === 0 && overBudgetResults.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <h2 className="text-xl font-black text-[var(--color-text)]">Nothing matched</h2>
            <p className="text-sm text-[var(--color-subtle)] max-w-xs">Try adjusting your filters or going back to try a different calorie amount.</p>
            <Link href="/demo/today" className="text-sm font-bold text-[var(--color-lime)] underline">← Back</Link>
          </div>
        )}

        {results.map((r) => <DemoRecipeCard key={r.recipe.id} r={r} />)}

        {overBudgetResults.length > 0 && (
          <>
            <div className="pt-2 pb-1">
              <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest">Slightly over your calories</p>
            </div>
            {overBudgetResults.map((r) => <DemoRecipeCard key={r.recipe.id} r={r} dimmed />)}
          </>
        )}

        {(results.length > 0 || overBudgetResults.length > 0) && (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4 mt-2">
            <p className="text-sm font-black text-[var(--color-text)] mb-1">Want to use Road2Abs for real?</p>
            <p className="text-xs text-[var(--color-subtle)] mb-3">Create a free account to save favourites, build shopping lists, track progress, and get recommendations from actual verified Swiss supermarket products.</p>
            <Link
              href="/auth/login"
              className="inline-block w-full text-center bg-[var(--color-lime)] text-[#0e0e0e] font-black text-sm py-3 rounded-[var(--radius-lg)]"
            >
              Create free account →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function DemoRecipeCard({ r, dimmed = false }: { r: RecommendationResult; dimmed?: boolean }) {
  return (
    <div className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden ${dimmed ? 'opacity-70' : ''}`}>
      {/* Protein indicator bar */}
      <div className="h-1" style={{
        background: r.reaches_protein_target
          ? 'var(--color-lime)'
          : r.reaches_protein_min
          ? 'var(--color-accent)'
          : 'var(--color-border-strong)',
      }} />

      <div className="p-4 flex flex-col gap-3">
        {/* Title + price */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-[var(--color-text)] text-base leading-tight mb-1.5">{r.recipe.name}</h3>
            <div className="flex flex-wrap gap-1.5 items-center">
              {r.recipe.stores_required?.map((s: string) => <StoreBadge key={s} store={s} />)}
              <span className="text-[11px] text-[var(--color-subtle)] font-medium">
                {r.recipe.total_time_min > 0 ? `${r.recipe.total_time_min} min` : 'No cooking'}
              </span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className={`text-base font-black ${r.over_budget ? 'text-[var(--color-warn)]' : 'text-[var(--color-text)]'}`}>
              {chf(r.price_chf)}
            </div>
          </div>
        </div>

        {/* Macro pills */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-surface-raised)] text-[var(--color-text)]">
            {Math.round(r.recipe.total_calories)} kcal
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#1e2800] text-[var(--color-lime)]">
            {Math.round(r.recipe.total_protein)}g protein
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-surface-raised)] text-[var(--color-muted)]">
            {Math.round(r.recipe.total_carbs)}g carbs
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-surface-raised)] text-[var(--color-muted)]">
            {Math.round(r.recipe.total_fat)}g fat
          </span>
        </div>

        {/* Why it fits */}
        <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-md)] px-3 py-2.5">
          <p className="text-xs font-semibold text-[var(--color-text)] leading-relaxed">{r.why}</p>
          <p className="text-[10px] text-[var(--color-subtle)] mt-1">
            {r.protein_efficiency}g protein per 100 kcal
          </p>
        </div>

        {/* Description */}
        {r.recipe.description && (
          <p className="text-xs text-[var(--color-muted)] leading-relaxed">{r.recipe.description}</p>
        )}

        {/* Badges */}
        {r.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {r.badges.slice(0, 3).map((b) => (
              <span key={b} className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#1e2800] text-[var(--color-lime)]">{b}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
