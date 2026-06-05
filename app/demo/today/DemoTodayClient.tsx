'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  { label: '300 kcal left', desc: 'Late evening, almost at target', calories: '300', protein: '40', situation: 'snack' as MealContext },
  { label: '2000 kcal left', desc: 'Early in the day, full day ahead', calories: '2000', protein: '130', situation: 'meal' as MealContext },
]

export default function DemoTodayClient({ targets }: { targets: NutritionTargets }) {
  const router = useRouter()
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [situation, setSituation] = useState<MealContext>('meal')
  const [store, setStore] = useState<Store | 'any_nearby'>('any_nearby')
  const [budget, setBudget] = useState('10')

  function applyPreset(p: typeof PRESETS[0]) {
    setCalories(p.calories)
    setProtein(p.protein)
    setSituation(p.situation)
  }

  function handleSubmit() {
    const params = new URLSearchParams({
      calories,
      protein,
      situation,
      store,
      nearby_only: String(store === 'any_nearby' || store === 'coop' || store === 'migros'),
      budget,
    })
    router.push(`/demo/results?${params.toString()}`)
  }

  const hasInput = calories.length > 0 && protein.length > 0

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">

      {/* Demo banner */}
      <div className="bg-[#1e2800] border-b border-[var(--color-lime)]/30 px-4 py-2.5 text-center">
        <p className="text-xs font-bold text-[var(--color-lime)]">
          Demo mode — no account needed · showing sample data only
        </p>
      </div>

      {/* Header */}
      <header className="bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 py-4">
        <h1 className="text-2xl font-black tracking-tight text-[var(--color-text)]">
          road<span className="text-[var(--color-lime)]">2</span>abs
        </h1>
        <p className="text-xs text-[var(--color-subtle)] mt-0.5">High-protein meals from Swiss supermarkets</p>
      </header>

      <div className="flex-1 px-4 pb-6 flex flex-col gap-5 pt-5">

        {/* Preset buttons */}
        <div>
          <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest mb-3">Try a preset</p>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                className={`text-left p-3.5 rounded-[var(--radius-xl)] border-2 transition-all ${
                  calories === p.calories && protein === p.protein
                    ? 'border-[var(--color-lime)] bg-[#1e2800]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)]'
                }`}
              >
                <div className={`text-sm font-black mb-0.5 ${calories === p.calories && protein === p.protein ? 'text-[var(--color-lime)]' : 'text-[var(--color-text)]'}`}>
                  {p.label}
                </div>
                <div className="text-[11px] text-[var(--color-subtle)] leading-tight">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Macro inputs */}
        <div>
          <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest mb-3">Or enter your own</p>
          <div className="flex gap-3">
            <div className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] mb-1">Calories left</div>
              <input
                type="number"
                inputMode="numeric"
                placeholder="e.g. 500"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
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
                onChange={(e) => setProtein(e.target.value)}
                className="w-full bg-transparent text-3xl font-black text-[var(--color-lime)] placeholder:text-[var(--color-subtle)] focus:outline-none tabular-nums"
              />
              <div className="text-xs text-[var(--color-subtle)] mt-1">grams</div>
            </div>
          </div>
        </div>

        {/* Situation */}
        <div>
          <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest mb-3">What are you after?</p>
          <div className="flex flex-wrap gap-2">
            {SITUATIONS.map((s) => (
              <button
                key={s.value}
                onClick={() => setSituation(s.value)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                  situation === s.value
                    ? 'bg-[var(--color-lime)] text-[#0e0e0e] border-[var(--color-lime)]'
                    : 'bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Store */}
        <div>
          <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest mb-3">Store</p>
          <div className="grid grid-cols-3 gap-2">
            {STORES.map((s) => (
              <button
                key={s.value}
                onClick={() => setStore(s.value)}
                className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-[var(--radius-xl)] transition-all border-2 ${
                  store === s.value
                    ? 'border-[var(--color-lime)] bg-[var(--color-surface-raised)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)]'
                }`}
              >
                {s.value === 'any_nearby'
                  ? <span className="text-lg">📍</span>
                  : <StoreLogoByName store={s.value} size={24} />
                }
                <span className={`text-[10px] font-bold ${store === s.value ? 'text-[var(--color-lime)]' : 'text-[var(--color-subtle)]'}`}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div>
          <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest mb-2">Budget</p>
          <div className="flex gap-2">
            {['8', '10', '15'].map((b) => (
              <button
                key={b}
                onClick={() => setBudget(b)}
                className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                  budget === b
                    ? 'bg-[var(--color-lime)] text-[#0e0e0e] border-[var(--color-lime)]'
                    : 'bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)]'
                }`}
              >
                CHF {b}
              </button>
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
          Show me what fits →
        </button>
        {!hasInput && (
          <p className="text-xs text-center text-[var(--color-subtle)] mt-2">Enter your remaining calories and protein</p>
        )}
      </div>
    </div>
  )
}
