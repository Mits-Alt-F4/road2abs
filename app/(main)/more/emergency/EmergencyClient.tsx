'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge, StoreBadge } from '@/components/ui/Badge'
import { proteinEfficiency } from '@/lib/utils/macros'
import { chf } from '@/lib/utils/format'

type CalFilter = 150 | 250 | 400 | null
type ProFilter = 20 | 30 | 40 | null

interface Recipe {
  id: string
  name: string
  total_calories: number
  total_protein: number
  total_carbs: number
  total_fat: number
  estimated_price_chf: number
  stores_required: string[]
  total_time_min: number
}

interface Props { recipes: Recipe[] }

export function EmergencyClient({ recipes }: Props) {
  const [calFilter, setCalFilter] = useState<CalFilter>(null)
  const [proFilter, setProFilter] = useState<ProFilter>(null)
  const [storeFilter, setStoreFilter] = useState<string | null>(null)

  const filtered = recipes.filter((r) => {
    if (calFilter && r.total_calories > calFilter) return false
    if (proFilter && r.total_protein < proFilter) return false
    if (storeFilter && !r.stores_required.includes(storeFilter)) return false
    return true
  }).sort((a, b) =>
    proteinEfficiency(b.total_protein, b.total_calories) -
    proteinEfficiency(a.total_protein, a.total_calories)
  )

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">
      <header className="safe-top sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 pt-[max(16px,env(safe-area-inset-top))] pb-3 flex items-center gap-3">
        <a href="/more" className="w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-lg text-[var(--color-muted)]">←</a>
        <div>
          <h1 className="text-xl font-black text-[var(--color-text)]">🆘 Emergency protein</h1>
          <p className="text-xs text-[var(--color-subtle)]">Most protein for fewest calories</p>
        </div>
      </header>

      <div className="px-4 py-4 flex flex-col gap-4">

        {/* Filters */}
        <Card padding="md">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wide mb-2">Max calories</p>
              <div className="flex gap-2 flex-wrap">
                {([null, 150, 250, 400] as CalFilter[]).map((c) => (
                  <button
                    key={String(c)}
                    onClick={() => setCalFilter(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      calFilter === c ? 'bg-[var(--color-accent)] text-white' : 'bg-stone-100 text-[var(--color-muted)]'
                    }`}
                  >
                    {c === null ? 'Any' : `Under ${c} kcal`}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wide mb-2">Min protein</p>
              <div className="flex gap-2 flex-wrap">
                {([null, 20, 30, 40] as ProFilter[]).map((p) => (
                  <button
                    key={String(p)}
                    onClick={() => setProFilter(p)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      proFilter === p ? 'bg-[var(--color-accent)] text-white' : 'bg-stone-100 text-[var(--color-muted)]'
                    }`}
                  >
                    {p === null ? 'Any' : `At least ${p}g`}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wide mb-2">Store</p>
              <div className="flex gap-2 flex-wrap">
                {([null, 'coop', 'migros', 'lidl', 'denner'] as const).map((s) => (
                  <button
                    key={String(s)}
                    onClick={() => setStoreFilter(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      storeFilter === s ? 'bg-stone-800 text-white' : 'bg-stone-100 text-[var(--color-muted)]'
                    }`}
                  >
                    {s === null ? 'Any store' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="text-4xl">🆘</div>
            <h3 className="text-base font-bold text-[var(--color-text)]">Nothing matched</h3>
            <p className="text-sm text-[var(--color-subtle)]">Try loosening the filters.</p>
          </div>
        ) : (
          filtered.map((r) => {
            const eff = proteinEfficiency(r.total_protein, r.total_calories)
            return (
              <Link key={r.id} href={`/recipe/${r.id}`}>
                <Card padding="md" className="active:scale-[0.98] transition-transform">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-[var(--color-text)] text-base">{r.name}</h3>
                    <span className="text-sm font-bold flex-shrink-0">{chf(r.estimated_price_chf)}</span>
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex flex-col">
                      <span className="text-2xl font-black text-[var(--color-accent)] tabular-nums">{Math.round(r.total_protein)}g</span>
                      <span className="text-[10px] text-[var(--color-subtle)] uppercase tracking-wide font-medium">protein</span>
                    </div>
                    <div className="text-[var(--color-subtle)] text-sm">for</div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-black text-[var(--color-text)] tabular-nums">{Math.round(r.total_calories)}</span>
                      <span className="text-[10px] text-[var(--color-subtle)] uppercase tracking-wide font-medium">kcal</span>
                    </div>
                    <div className="ml-auto">
                      <Badge label={`${eff}g/100kcal`} variant="accent" />
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {r.stores_required.map((s) => <StoreBadge key={s} store={s} />)}
                    {r.total_time_min === 0 && <Badge label="No cooking" variant="green" />}
                  </div>
                </Card>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
