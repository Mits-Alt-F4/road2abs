'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppShell } from '@/components/v2/AppShell'
import { RecipeCard } from '@/components/v2/RecipeCard'
import { chf } from '@/lib/utils/format'
import type { MacroInput, RecommendationResult } from '@/types'

interface Props {
  results: RecommendationResult[]
  overBudgetResults: RecommendationResult[]
  remaining: MacroInput
  budget: number
  calorieBand: string
}

const bandLabel: Record<string, string> = {
  emergency: 'Under 300 kcal — snacks & emergency protein',
  light:     '300–600 kcal — light meals & snacks',
  medium:    '600–900 kcal — normal meals',
  large:     '900+ kcal — full meals',
}

export default function DemoResultsClient({ results, overBudgetResults, remaining, budget, calorieBand }: Props) {
  const router = useRouter()
  const [saved, setSaved] = useState(new Set<string>())
  const [listed, setListed] = useState(new Set<string>())

  function toggleSave(id: string) {
    setSaved(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  return (
    <AppShell>
      {/* Demo banner */}
      <div className="bg-[#0f1a0a] border-b border-[var(--color-lime)]/10 px-4 py-2 text-center">
        <p className="text-[10px] font-bold text-[var(--color-lime)]/60 uppercase tracking-widest">
          Demo ·{' '}
          <Link href="/demo/today" className="underline text-[var(--color-lime)]/80">← Back</Link>
          {' · '}
          <Link href="/demo/products" className="underline text-[var(--color-lime)]/80">Products</Link>
          {' · '}
          <Link href="/demo/shopping-list" className="underline text-[var(--color-lime)]/80">List</Link>
        </p>
      </div>

      <header className="sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] font-bold text-sm flex-shrink-0">
          ←
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-[15px] font-black text-[var(--color-text)]">
            {results.length > 0 ? `${results.length} option${results.length !== 1 ? 's' : ''}` : 'No matches'}
          </h1>
          <p className="text-[11px] text-[var(--color-subtle)] truncate">
            {Math.round(remaining.calories ?? 0)} kcal · {Math.round(remaining.protein ?? 0)}g protein · {chf(budget)}
          </p>
        </div>
      </header>

      <div className="px-4 py-3 flex flex-col gap-3 pb-12">

        {/* Band context */}
        {calorieBand && bandLabel[calorieBand] && (
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-widest">
              {bandLabel[calorieBand]}
            </p>
            <Link href="/demo/today" className="text-[10px] text-[var(--color-subtle)] underline">
              Change inputs
            </Link>
          </div>
        )}

        {results.length === 0 && overBudgetResults.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-base font-black text-[var(--color-text)] mb-2">Nothing matched</p>
            <p className="text-sm text-[var(--color-subtle)] mb-4">Try adjusting your filters or entering different values.</p>
            <Link href="/demo/today"
              className="inline-block bg-[var(--color-lime)] text-[#0D0F0E] font-black text-sm px-5 py-2.5 rounded-[var(--radius-lg)]">
              ← Back
            </Link>
          </div>
        )}

        {results.map(r => (
          <RecipeCard key={r.recipe.id} r={r}
            href="/demo/recipe"
            saved={saved.has(r.recipe.id)}
            listed={listed.has(r.recipe.id)}
            onSave={toggleSave}
            onList={id => setListed(prev => new Set([...prev, id]))}
          />
        ))}

        {overBudgetResults.length > 0 && (
          <>
            <p className="text-[10px] font-bold text-[var(--color-subtle)] uppercase tracking-widest pt-1">
              Too big for today
            </p>
            {overBudgetResults.map(r => (
              <RecipeCard key={r.recipe.id} r={r} href="/demo/recipe" dimmed />
            ))}
          </>
        )}

        {results.length > 0 && (
          <>
            {/* Cross-links */}
            <div className="flex flex-col gap-2 pt-2">
              {[
                { href: '/demo/products', label: 'Product Library', sub: 'Verified Swiss supermarket products' },
                { href: '/demo/recipe',   label: 'Recipe Detail',   sub: 'Steps, ingredients & shopping list' },
                { href: '/demo/shopping-list', label: 'Shopping List', sub: 'Grouped by store, tap to check off' },
              ].map(s => (
                <Link key={s.href} href={s.href}
                  className="flex items-center justify-between p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
                  <div>
                    <p className="text-sm font-bold text-[var(--color-text)]">{s.label}</p>
                    <p className="text-[11px] text-[var(--color-subtle)]">{s.sub}</p>
                  </div>
                  <span className="text-[var(--color-subtle)] ml-3 flex-shrink-0">→</span>
                </Link>
              ))}
            </div>

            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4">
              <p className="text-sm font-black text-[var(--color-text)] mb-1">Use this for real</p>
              <p className="text-[11px] text-[var(--color-subtle)] mb-3 leading-relaxed">
                Connect your actual macros, save favourites, and get recommendations from verified Swiss products.
              </p>
              <a href="/auth/login"
                className="block text-center bg-[var(--color-lime)] text-[#0D0F0E] font-black text-sm py-2.5 rounded-[var(--radius-lg)]">
                Create free account →
              </a>
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}
