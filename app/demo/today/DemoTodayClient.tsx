'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/v2/AppShell'
import { RecipeCard } from '@/components/v2/RecipeCard'
import { StoreLogoByName } from '@/components/ui/StoreLogo'
import { DEMO_RECIPES, DEMO_TARGETS, isValidRecipe } from '@/lib/demo/data'
import { scoreRecipe, calorieBand, recipeMatchesBand } from '@/lib/utils/macros'
import type { NutritionTargets, MealContext, Store } from '@/types'

const SITUATIONS: { value: MealContext; label: string }[] = [
  { value: 'meal',             label: 'Meal' },
  { value: 'snack',            label: 'Snack' },
  { value: 'sweet',            label: 'Sweet' },
  { value: 'emergency_protein',label: 'Emergency' },
  { value: 'no_cooking',       label: 'No cook' },
  { value: 'meal_prep',        label: 'Prep' },
]

const STORES: { value: Store | 'any_nearby'; label: string }[] = [
  { value: 'any_nearby', label: 'Nearby' },
  { value: 'coop',       label: 'Coop' },
  { value: 'migros',     label: 'Migros' },
  { value: 'lidl',       label: 'Lidl' },
  { value: 'denner',     label: 'Denner' },
]

export default function DemoTodayClient({ targets }: { targets: NutritionTargets }) {
  const router = useRouter()

  // Core inputs — string state, always defined
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [situation, setSituation] = useState<MealContext>('meal')
  const [store, setStore] = useState<Store | 'any_nearby'>('any_nearby')
  const [saved, setSaved] = useState(new Set<string>())
  const [listed, setListed] = useState(new Set<string>())

  // Derived — whether we have enough input to show recommendations
  const calNum = parseFloat(calories)
  const proNum = parseFloat(protein)
  const hasCalories = !isNaN(calNum) && calNum > 0
  const hasProtein  = !isNaN(proNum) && proNum > 0
  const hasInput    = hasCalories  // Show results as soon as calories are entered

  // Inline recommendations — computed synchronously, instant
  const recommendations = useMemo(() => {
    if (!hasCalories) return []

    const effectivePro = hasProtein ? proNum : targets.protein_target * 0.3
    const remaining = { calories: calNum, protein: effectivePro, carbs: null, fat: null }
    const band = calorieBand(calNum)

    return DEMO_RECIPES
      .filter(r => {
        if (!isValidRecipe(r)) return false
        if (!recipeMatchesBand(r, band)) return false

        // Situation filter
        const ctx = r.suitable_contexts ?? []
        if (situation === 'emergency_protein' && !ctx.includes('emergency_protein') && !ctx.includes('snack')) return false
        if (situation === 'snack' && !ctx.includes('snack') && !ctx.includes('sweet') && !ctx.includes('no_cooking')) return false
        if (situation === 'sweet' && !ctx.includes('sweet') && !ctx.includes('snack')) return false
        if (situation === 'no_cooking' && r.total_time_min > 0 && !ctx.includes('no_cooking')) return false
        if (situation === 'meal_prep' && !ctx.includes('meal_prep')) return false

        // Store filter
        const stores = r.stores_required ?? []
        if (store !== 'any_nearby' && !stores.includes(store as never)) return false

        return true
      })
      .map(r => scoreRecipe(r, remaining, 10, targets, false, false))
      .sort((a, b) => b.score - a.score)
  }, [calNum, proNum, hasCalories, hasProtein, situation, store, targets])

  const topResults = recommendations.filter(r => r.fits_calories).slice(0, 4)
  const overLimit  = recommendations.filter(r => !r.fits_calories).slice(0, 2)
  const band = hasCalories ? calorieBand(calNum) : null

  const bandBadge: Record<string, string> = {
    emergency: 'Under 300 kcal — snacks only',
    light:     '300–600 kcal — light meals',
    medium:    '600–900 kcal — normal meals',
    large:     '900+ kcal — full meals',
  }

  return (
    <AppShell>
      {/* Demo banner */}
      <div className="bg-[#0f1a0a] border-b border-[var(--color-lime)]/10 px-4 py-2 flex items-center justify-between">
        <p className="text-[10px] font-bold text-[var(--color-lime)]/60 uppercase tracking-widest">Demo mode</p>
        <div className="flex gap-3 text-[10px] text-[var(--color-subtle)]">
          <Link href="/demo/products" className="hover:text-[var(--color-muted)]">Products</Link>
          <Link href="/demo/recipe" className="hover:text-[var(--color-muted)]">Recipe</Link>
          <Link href="/demo/shopping-list" className="hover:text-[var(--color-muted)]">List</Link>
          <a href="/auth/login" className="text-[var(--color-lime)]/80 font-semibold">Sign up</a>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 py-3 flex items-center justify-between">
        <span className="text-[18px] font-black tracking-tight text-[var(--color-text)]">
          road<span className="text-[var(--color-lime)]">2</span>abs
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[var(--color-subtle)]">
            {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
        </div>
      </header>

      <div className="px-4 pt-5 pb-28 flex flex-col gap-5">

        {/* ── MAIN QUESTION + INPUTS ─────────────────────────────────────── */}
        <div>
          <p className="text-[11px] font-bold text-[var(--color-muted)] uppercase tracking-widest mb-3">
            What fits today?
          </p>
          <div className="flex gap-2.5">
            {/* Calories */}
            <div className={`flex-1 rounded-[var(--radius-xl)] px-4 pt-3.5 pb-3 border-2 transition-colors ${
              hasCalories ? 'bg-[var(--color-surface)] border-[var(--color-border-strong)]' : 'bg-[var(--color-surface)] border-[var(--color-border)]'
            }`}>
              <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-subtle)] mb-1">Calories left</p>
              <input
                type="number"
                inputMode="numeric"
                placeholder="500"
                value={calories}
                onChange={e => setCalories(e.target.value)}
                className="w-full bg-transparent text-[2rem] font-black text-[var(--color-text)] focus:outline-none tabular-nums leading-none placeholder:text-[var(--color-subtle)]/40"
              />
              <p className="text-[10px] text-[var(--color-subtle)] mt-1">kcal</p>
            </div>

            {/* Protein */}
            <div className={`flex-1 rounded-[var(--radius-xl)] px-4 pt-3.5 pb-3 border-2 transition-colors ${
              hasProtein ? 'bg-[var(--color-surface)] border-[var(--color-lime)]/40' : 'bg-[var(--color-surface)] border-[var(--color-border)]'
            }`}>
              <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-subtle)] mb-1">Protein left</p>
              <input
                type="number"
                inputMode="decimal"
                placeholder="60"
                value={protein}
                onChange={e => setProtein(e.target.value)}
                className="w-full bg-transparent text-[2rem] font-black text-[var(--color-lime)] focus:outline-none tabular-nums leading-none placeholder:text-[var(--color-subtle)]/40"
              />
              <p className="text-[10px] text-[var(--color-subtle)] mt-1">grams</p>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex gap-2 mt-2.5">
            {[{c:'300',p:'40',l:'300 kcal'},{c:'500',p:'60',l:'500 kcal'},{c:'1000',p:'80',l:'1000 kcal'},{c:'2000',p:'120',l:'2000 kcal'}].map(pr => (
              <button key={pr.c} onClick={() => { setCalories(pr.c); setProtein(pr.p) }}
                className={`flex-1 py-1.5 rounded-full text-[10px] font-bold border transition-all ${
                  calories === pr.c
                    ? 'bg-[var(--color-lime)] text-[#0D0F0E] border-[var(--color-lime)]'
                    : 'bg-[var(--color-surface)] text-[var(--color-subtle)] border-[var(--color-border)]'
                }`}>{pr.l}</button>
            ))}
          </div>
        </div>

        {/* ── SITUATION ─────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-1.5">
          {SITUATIONS.map(s => (
            <button key={s.value} onClick={() => setSituation(s.value)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                situation === s.value
                  ? 'bg-[var(--color-lime)] text-[#0D0F0E] border-[var(--color-lime)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)]'
              }`}>{s.label}</button>
          ))}
        </div>

        {/* ── STORE ─────────────────────────────────────────────────────── */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {STORES.map(s => (
            <button key={s.value} onClick={() => setStore(s.value)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-bold border flex-shrink-0 transition-all ${
                store === s.value
                  ? 'border-[var(--color-lime)] bg-[var(--color-lime-dim)] text-[var(--color-lime)]'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]'
              }`}>
              {s.value === 'any_nearby'
                ? '📍'
                : <StoreLogoByName store={s.value} size={14} />}
              {s.label}
            </button>
          ))}
        </div>

        {/* ── RECOMMENDATIONS ───────────────────────────────────────────── */}
        {!hasInput && (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] px-4 py-8 text-center">
            <p className="text-sm font-bold text-[var(--color-text)] mb-1">Enter your remaining calories above</p>
            <p className="text-[11px] text-[var(--color-subtle)]">Options appear instantly as you type</p>
            <div className="flex gap-2 justify-center mt-3">
              <button onClick={() => { setCalories('300'); setProtein('40') }}
                className="text-[11px] font-bold text-[var(--color-lime)] bg-[var(--color-lime-dim)] px-3 py-1.5 rounded-full">
                Try 300 kcal
              </button>
              <button onClick={() => { setCalories('2000'); setProtein('120') }}
                className="text-[11px] font-bold text-[var(--color-lime)] bg-[var(--color-lime-dim)] px-3 py-1.5 rounded-full">
                Try 2000 kcal
              </button>
            </div>
          </div>
        )}

        {hasInput && (
          <>
            {/* Band label */}
            {band && (
              <div className="flex items-center justify-between px-1">
                <p className="text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-widest">
                  {bandBadge[band]}
                </p>
                <span className="text-[10px] text-[var(--color-subtle)]">{topResults.length} options</span>
              </div>
            )}

            {/* No matches */}
            {topResults.length === 0 && (
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] px-4 py-6 text-center">
                <p className="text-sm font-bold text-[var(--color-text)] mb-1">No matches for this filter</p>
                <p className="text-[11px] text-[var(--color-subtle)]">Try a different situation or store</p>
              </div>
            )}

            {/* Top results inline */}
            {topResults.map(r => (
              <RecipeCard
                key={r.recipe.id}
                r={r}
                href={`/demo/recipe`}
                saved={saved.has(r.recipe.id)}
                listed={listed.has(r.recipe.id)}
                onSave={id => setSaved(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })}
                onList={id => setListed(prev => new Set([...prev, id]))}
              />
            ))}

            {/* Over-limit section */}
            {overLimit.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-[var(--color-subtle)] uppercase tracking-widest mb-2">Too big for today</p>
                {overLimit.map(r => (
                  <RecipeCard key={r.recipe.id} r={r} href="/demo/recipe" dimmed />
                ))}
              </div>
            )}

            {/* See all link */}
            {recommendations.length > 4 && (
              <Link href={`/demo/results?calories=${calNum}&protein=${proNum}&situation=${situation}&store=${store}`}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] text-sm font-bold text-[var(--color-muted)]">
                See all {recommendations.length} options →
              </Link>
            )}
          </>
        )}

        {/* Targets reminder */}
        <div className="flex items-center justify-between px-1 pb-2">
          <p className="text-[10px] text-[var(--color-subtle)]">
            Daily target: {targets.calories.toLocaleString()} kcal · {targets.protein_target}g protein
          </p>
          <Link href="/demo/products" className="text-[10px] text-[var(--color-muted)] underline">
            Product library →
          </Link>
        </div>
      </div>
    </AppShell>
  )
}
