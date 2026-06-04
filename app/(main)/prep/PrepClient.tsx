'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { MacroRow } from '@/components/ui/MacroTag'
import { StoreBadge } from '@/components/ui/Badge'
import { chf } from '@/lib/utils/format'

interface Recipe {
  id: string
  name: string
  description: string | null
  total_calories: number
  total_protein: number
  total_carbs: number
  total_fat: number
  estimated_price_chf: number
  servings: number
  stores_required: string[]
  total_time_min: number
}

interface Props {
  recipes: Recipe[]
  userId: string
}

export function PrepClient({ recipes }: Props) {
  const [portions, setPortions] = useState('4')
  const [caloriesPerServing, setCaloriesPerServing] = useState('580')
  const [proteinPerServing, setProteinPerServing] = useState('50')
  const [budgetPerServing, setBudgetPerServing] = useState('4.50')

  const portNum = parseInt(portions) || 4

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">
      <header className="safe-top sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 pt-[max(16px,env(safe-area-inset-top))] pb-3">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Meal prep</h1>
        <p className="text-sm text-[var(--color-subtle)] mt-0.5">Cook once, eat for the week</p>
      </header>

      <div className="px-4 py-4 flex flex-col gap-4">

        {/* Config */}
        <Card padding="md">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--color-text)] mb-3">Your prep plan</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-[var(--color-text)] block mb-1">Number of portions</label>
              <div className="flex gap-2">
                {[2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setPortions(String(n))}
                    className={`flex-1 py-2 rounded-[var(--radius-md)] text-sm font-bold transition-all ${
                      portions === String(n)
                        ? 'bg-[var(--color-accent)] text-white'
                        : 'bg-stone-100 text-[var(--color-muted)]'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <Input
              label="Budget / portion"
              type="number"
              inputMode="decimal"
              unit="CHF"
              value={budgetPerServing}
              onChange={(e) => setBudgetPerServing(e.target.value)}
            />
            <Input
              label="Calories / portion"
              type="number"
              inputMode="numeric"
              unit="kcal"
              value={caloriesPerServing}
              onChange={(e) => setCaloriesPerServing(e.target.value)}
            />
            <Input
              label="Protein / portion"
              type="number"
              inputMode="decimal"
              unit="g"
              value={proteinPerServing}
              onChange={(e) => setProteinPerServing(e.target.value)}
            />
          </div>
        </Card>

        {/* Summary line */}
        <div className="flex items-center gap-3 bg-[var(--color-accent-light)] rounded-[var(--radius-lg)] px-4 py-3 text-sm">
          <span className="text-[var(--color-accent-dark)] font-semibold">
            {portNum} × {caloriesPerServing} kcal · {portNum} × {proteinPerServing}g protein
          </span>
          <span className="text-[var(--color-accent)]">·</span>
          <span className="text-[var(--color-accent-dark)] font-semibold">
            Total budget: CHF {(parseFloat(budgetPerServing || '0') * portNum).toFixed(2)}
          </span>
        </div>

        <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--color-text)] mt-2">Prep-friendly recipes</h2>

        {recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="text-4xl">📦</div>
            <h3 className="text-base font-bold text-[var(--color-text)]">No prep recipes yet</h3>
            <p className="text-sm text-[var(--color-subtle)] max-w-xs">
              Meal-prep recipes will appear here once added to your database.
            </p>
          </div>
        ) : (
          recipes.map((r) => {
            const perPortion = portNum / r.servings
            return (
              <Card key={r.id} padding="md">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-[var(--color-text)] text-base">{r.name}</h3>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold">{chf(r.estimated_price_chf * perPortion)}</div>
                    <div className="text-xs text-[var(--color-subtle)]">{chf(r.estimated_price_chf / r.servings)}/portion</div>
                  </div>
                </div>
                {r.description && (
                  <p className="text-xs text-[var(--color-muted)] mb-2">{r.description}</p>
                )}
                <MacroRow
                  calories={r.total_calories}
                  protein={r.total_protein}
                  carbs={r.total_carbs}
                  fat={r.total_fat}
                  size="sm"
                />
                <div className="flex gap-1.5 mt-2 flex-wrap items-center">
                  {r.stores_required.map((s) => <StoreBadge key={s} store={s} />)}
                  {r.total_time_min > 0 && (
                    <span className="text-[11px] text-[var(--color-subtle)]">{r.total_time_min} min total</span>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-[var(--color-border)] grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <div className="font-bold text-[var(--color-text)]">{portNum}</div>
                    <div className="text-[var(--color-subtle)]">portions</div>
                  </div>
                  <div>
                    <div className="font-bold text-[var(--color-accent)]">
                      {Math.round(r.total_protein / r.servings * perPortion)}g
                    </div>
                    <div className="text-[var(--color-subtle)]">protein each</div>
                  </div>
                  <div>
                    <div className="font-bold text-[var(--color-text)]">
                      {Math.round(r.total_calories / r.servings * perPortion)} kcal
                    </div>
                    <div className="text-[var(--color-subtle)]">each</div>
                  </div>
                </div>
                <Link href={`/recipe/${r.id}`}>
                  <Button variant="secondary" size="sm" fullWidth className="mt-3">
                    View full recipe →
                  </Button>
                </Link>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
