'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { MacroRow } from '@/components/ui/MacroTag'
import { StoreBadge } from '@/components/ui/Badge'
import { chf } from '@/lib/utils/format'

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

interface ShoppingList {
  id: string
  name: string
  created_at: string
  shopping_list_items?: { count: number }[]
}

interface Props {
  recipes: Recipe[]
  shoppingLists: ShoppingList[]
  userId: string
}

export function SavedClient({ recipes, shoppingLists }: Props) {
  const [tab, setTab] = useState<'meals' | 'lists'>('meals')

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">
      <header className="safe-top sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 pt-[max(16px,env(safe-area-inset-top))] pb-0">
        <h1 className="text-2xl font-black text-[var(--color-text)] mb-3">Saved</h1>
        <div className="flex gap-0 border-b border-[var(--color-border)] -mx-4 px-4">
          {(['meals', 'lists'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                tab === t
                  ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                  : 'border-transparent text-[var(--color-muted)]'
              }`}
            >
              {t === 'meals' ? 'Favourite meals' : 'Shopping lists'}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 py-4 flex flex-col gap-3">
        {tab === 'meals' && (
          <>
            {recipes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                <div className="text-4xl">♡</div>
                <h2 className="text-lg font-bold text-[var(--color-text)]">No favourites yet</h2>
                <p className="text-sm text-[var(--color-subtle)] max-w-xs">
                  Save meals you would actually buy again. They show up here and on your homepage.
                </p>
              </div>
            ) : (
              recipes.map((r) => (
                <Link key={r.id} href={`/recipe/${r.id}`}>
                  <Card padding="md" className="active:scale-[0.98] transition-transform">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-[var(--color-text)] text-base">{r.name}</h3>
                      <span className="text-sm font-bold text-[var(--color-text)] flex-shrink-0">{chf(r.estimated_price_chf)}</span>
                    </div>
                    <MacroRow calories={r.total_calories} protein={r.total_protein} size="sm" />
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {r.stores_required.map((s) => <StoreBadge key={s} store={s} />)}
                      {r.total_time_min > 0 && (
                        <span className="text-[11px] text-[var(--color-subtle)]">{r.total_time_min} min</span>
                      )}
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </>
        )}

        {tab === 'lists' && (
          <>
            {shoppingLists.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                <div className="text-4xl">🛒</div>
                <h2 className="text-lg font-bold text-[var(--color-text)]">No lists yet</h2>
                <p className="text-sm text-[var(--color-subtle)] max-w-xs">
                  Choose a recipe and tap "Add to shopping list" to create one.
                </p>
              </div>
            ) : (
              shoppingLists.map((list) => (
                <Link key={list.id} href={`/shopping-list/${list.id}`}>
                  <Card padding="md" className="active:scale-[0.98] transition-transform">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-[var(--color-text)]">{list.name}</h3>
                        <p className="text-xs text-[var(--color-subtle)] mt-0.5">
                          {new Date(list.created_at).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <span className="text-2xl">🛒</span>
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </>
        )}
      </div>
    </div>
  )
}
