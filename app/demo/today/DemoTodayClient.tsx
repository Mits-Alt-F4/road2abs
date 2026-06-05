'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { StoreLogoByName } from '@/components/ui/StoreLogo'
import type { NutritionTargets, MealContext, Store } from '@/types'

const SITUATIONS: { value: MealContext; label: string }[] = [
  { value: 'meal', label: 'Full meal' },
  { value: 'snack', label: 'Snack' },
  { value: 'sweet', label: 'Something sweet' },
  { value: 'no_cooking', label: 'No cooking' },
  { value: 'emergency_protein', label: 'Max protein' },
  { value: 'meal_prep', label: 'Meal prep' },
]

const STORES: { value: Store | 'any_nearby'; label: string }[] = [
  { value: 'any_nearby', label: 'Any nearby' },
  { value: 'coop', label: 'Coop' },
  { value: 'migros', label: 'Migros' },
  { value: 'lidl', label: 'Lidl' },
  { value: 'denner', label: 'Denner' },
]

const PRESETS = [
  {
    label: '300 kcal left',
    desc: 'Late evening, nearly at target — only snacks + emergency protein shown',
    calories: '300',
    protein: '40',
    situation: 'snack' as MealContext,
    tag: 'Try this first',
  },
  {
    label: '2000 kcal left',
    desc: 'Early in the day — full meals shown, sorted by protein fit',
    calories: '2000',
    protein: '120',
    situation: 'meal' as MealContext,
    tag: 'Then try this',
  },
]

const DEMO_SECTIONS = [
  { href: '/demo/products', label: 'Product Library', desc: 'Real Coop & Migros products with photos' },
  { href: '/demo/recipe', label: 'Recipe Detail', desc: 'Full recipe with steps, macros & shopping list' },
  { href: '/demo/shopping-list', label: 'Shopping List', desc: 'List grouped by store with item check-off' },
]

export default function DemoTodayClient({ targets }: { targets: NutritionTargets }) {
  const router = useRouter()
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [situation, setSituation] = useState<MealContext>('meal')
  const [store, setStore] = useState<Store | 'any_nearby'>('any_nearby')
  const [budget, setBudget] = useState('10')
  const [activePreset, setActivePreset] = useState<string | null>(null)

  function applyPreset(p: typeof PRESETS[0]) {
    setCalories(p.calories)
    setProtein(p.protein)
    setSituation(p.situation)
    setActivePreset(p.label)
  }

  function handleSubmit() {
    router.push(`/demo/results?calories=${calories}&protein=${protein}&situation=${situation}&store=${store}&budget=${budget}`)
  }

  const hasInput = calories.length > 0 && protein.length > 0

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">

      {/* Demo banner */}
      <div className="bg-[#1a2200] border-b border-[var(--color-lime)]/20 px-4 py-2.5">
        <p className="text-xs font-bold text-[var(--color-lime)] text-center">
          Demo — no login needed · sample data only ·{' '}
          <a href="/auth/login" className="underline opacity-70">Create account →</a>
        </p>
      </div>

      {/* Header */}
      <header className="bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 py-4">
        <h1 className="text-2xl font-black tracking-tight text-[var(--color-text)]">
          road<span className="text-[var(--color-lime)]">2</span>abs
        </h1>
        <p className="text-xs text-[var(--color-subtle)] mt-0.5">High-protein meals from Swiss supermarkets · demo mode</p>
      </header>

      <div className="flex-1 px-4 pb-6 flex flex-col gap-6 pt-5">

        {/* Other demo sections */}
        <div>
          <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest mb-3">Explore the demo</p>
          <div className="flex flex-col gap-2">
            {DEMO_SECTIONS.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="flex items-center justify-between p-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] active:scale-[0.98] transition-transform"
              >
                <div>
                  <div className="text-sm font-bold text-[var(--color-text)]">{s.label}</div>
                  <div className="text-xs text-[var(--color-subtle)] mt-0.5">{s.desc}</div>
                </div>
                <span className="text-[var(--color-muted)] text-lg ml-3">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[var(--color-border)]" />
          <span className="text-xs text-[var(--color-subtle)] font-semibold">Try the recommendation engine</span>
          <div className="flex-1 h-px bg-[var(--color-border)]" />
        </div>

        {/* Presets */}
        <div>
          <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest mb-3">
            Pick a test state — see how results change
          </p>
          <div className="grid grid-cols-1 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                className={`text-left p-4 rounded-[var(--radius-xl)] border-2 transition-all ${
                  activePreset === p.label
                    ? 'border-[var(--color-lime)] bg-[#1a2200]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-base font-black ${activePreset === p.label ? 'text-[var(--color-lime)]' : 'text-[var(--color-text)]'}`}>
                    {p.label}
                  </span>
                  <span className="text-[10px] font-bold bg-[var(--color-surface-raised)] text-[var(--color-muted)] px-2 py-0.5 rounded-full">
                    {p.tag}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-subtle)] leading-relaxed">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom inputs */}
        <div>
          <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest mb-3">Or enter your own</p>
          <div className="flex gap-3 mb-4">
            <div className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] mb-1">Calories left</div>
              <input
                type="number"
                inputMode="numeric"
                placeholder="e.g. 500"
                value={calories}
                onChange={(e) => { setCalories(e.target.value); setActivePreset(null) }}
                className="w-full bg-transparent text-3xl font-black text-[var(--color-text)] placeholder:text-[var(--color-subtle)] focus:outline-none tabular-nums"
              />
              <div className="text-xs text-[var(--color-subtle)] mt-1">kcal</div>
            </div>
            <div className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] mb-1">Protein left</div>
              <input
                type="number"
                inputMode="decimal"
                placeholder="e.g. 60"
                value={protein}
                onChange={(e) => { setProtein(e.target.value); setActivePreset(null) }}
                className="w-full bg-transparent text-3xl font-black text-[var(--color-lime)] placeholder:text-[var(--color-subtle)] focus:outline-none tabular-nums"
              />
              <div className="text-xs text-[var(--color-subtle)] mt-1">grams</div>
            </div>
          </div>

          {/* Situation */}
          <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest mb-2">What are you after?</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {SITUATIONS.map((s) => (
              <button key={s.value} onClick={() => setSituation(s.value)}
                className={`px-3.5 py-2 rounded-full text-sm font-bold border transition-all ${
                  situation === s.value
                    ? 'bg-[var(--color-lime)] text-[#0e0e0e] border-[var(--color-lime)]'
                    : 'bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)]'
                }`}>{s.label}</button>
            ))}
          </div>

          {/* Store */}
          <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest mb-2">Store</p>
          <div className="grid grid-cols-5 gap-1.5 mb-4">
            {STORES.map((s) => (
              <button key={s.value} onClick={() => setStore(s.value)}
                className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-[var(--radius-lg)] border-2 transition-all ${
                  store === s.value ? 'border-[var(--color-lime)] bg-[var(--color-surface-raised)]' : 'border-[var(--color-border)] bg-[var(--color-surface)]'
                }`}>
                {s.value === 'any_nearby' ? <span className="text-base">📍</span> : <StoreLogoByName store={s.value} size={20} />}
                <span className={`text-[9px] font-bold leading-none ${store === s.value ? 'text-[var(--color-lime)]' : 'text-[var(--color-subtle)]'}`}>{s.label}</span>
              </button>
            ))}
          </div>

          {/* Budget */}
          <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest mb-2">Budget</p>
          <div className="flex gap-2">
            {['8', '10', '15'].map((b) => (
              <button key={b} onClick={() => setBudget(b)}
                className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                  budget === b ? 'bg-[var(--color-lime)] text-[#0e0e0e] border-[var(--color-lime)]' : 'bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)]'
                }`}>CHF {b}</button>
            ))}
          </div>
        </div>

      </div>

      {/* CTA */}
      <div className="sticky bottom-0 bg-[var(--color-bg)] border-t border-[var(--color-border)] px-4 py-3">
        <button
          onClick={handleSubmit}
          disabled={!hasInput}
          className={`w-full h-14 rounded-[var(--radius-lg)] text-lg font-black transition-all ${
            hasInput
              ? 'bg-[var(--color-lime)] text-[#0e0e0e] shadow-lg shadow-[var(--color-lime)]/20 active:scale-[0.98]'
              : 'bg-[var(--color-surface)] text-[var(--color-subtle)] cursor-not-allowed'
          }`}
        >
          {hasInput ? 'Show me what fits →' : 'Select a preset or enter numbers above'}
        </button>
      </div>
    </div>
  )
}
