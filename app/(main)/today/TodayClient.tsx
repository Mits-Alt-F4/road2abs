'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StoreLogoByName } from '@/components/ui/StoreLogo'
import { formatDate } from '@/lib/utils/format'
import type { NutritionTargets, MealContext, MealTime, Store, TimeFilter } from '@/types'

const SITUATIONS: { value: MealContext; label: string }[] = [
  { value: 'meal',             label: 'Meal' },
  { value: 'snack',            label: 'Snack' },
  { value: 'sweet',            label: 'Sweet' },
  { value: 'no_cooking',       label: 'No cooking' },
  { value: 'emergency_protein',label: 'Max protein' },
  { value: 'meal_prep',        label: 'Meal prep' },
]

const MEAL_TIMES: { value: MealTime; label: string }[] = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch',     label: 'Lunch' },
  { value: 'dinner',    label: 'Dinner' },
  { value: 'late_night',label: 'Late night' },
  { value: 'post_gym',  label: 'Post gym' },
]

const STORES: { value: Store | 'any_nearby'; label: string }[] = [
  { value: 'any_nearby', label: 'Nearby' },
  { value: 'coop',       label: 'Coop' },
  { value: 'migros',     label: 'Migros' },
  { value: 'lidl',       label: 'Lidl' },
  { value: 'denner',     label: 'Denner' },
]

const TIME_FILTERS: { value: TimeFilter; label: string }[] = [
  { value: 'none',     label: 'No cooking' },
  { value: 'under_10', label: '< 10 min' },
  { value: 'under_20', label: '< 20 min' },
  { value: 'any',      label: 'Any' },
]

interface Props {
  targets: NutritionTargets
  profile: Record<string, unknown> | null
  favouriteIds: string[]
  recentRecipes: unknown[]
}

export function TodayClient({ targets, recentRecipes }: Props) {
  const router = useRouter()
  const [mode, setMode] = useState<'remaining' | 'consumed'>('remaining')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [showOptional, setShowOptional] = useState(false)
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')
  const [situation, setSituation] = useState<MealContext>('meal')
  const [mealTime, setMealTime] = useState<MealTime | null>(null)
  const [store, setStore] = useState<Store | 'any_nearby'>('any_nearby')
  const [nearbyOnly, setNearbyOnly] = useState(true)
  const [budget, setBudget] = useState('10')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('any')
  const [maxProtein, setMaxProtein] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const calNum = parseFloat(calories) || 0
  const proNum = parseFloat(protein) || 0
  const remCal = mode === 'remaining' ? calNum : Math.max(0, targets.calories - calNum)
  const remPro = mode === 'remaining' ? proNum : Math.max(0, targets.protein_target - proNum)
  const calPct  = mode === 'consumed' ? Math.min(100, (calNum / targets.calories) * 100) : 0

  function handleSubmit() {
    const p = new URLSearchParams({
      calories: String(remCal), protein: String(remPro),
      ...(carbs && { carbs }), ...(fat && { fat }),
      situation, ...(mealTime && { meal_time: mealTime }),
      store, nearby_only: String(nearbyOnly), budget,
      time_filter: timeFilter, max_protein: String(maxProtein),
    })
    router.push(`/results?${p.toString()}`)
  }

  const hasInput = calories.length > 0 && protein.length > 0

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">

      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <header className="safe-top sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 pt-[max(12px,env(safe-area-inset-top))] pb-3">
        <div className="flex items-center justify-between">
          <span className="text-xl font-black tracking-tight text-[var(--color-text)]">
            road<span className="text-[var(--color-lime)]">2</span>abs
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--color-subtle)]">{formatDate()}</span>
            <a href="/more/settings"
              className="w-8 h-8 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--color-muted)]">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </a>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 pt-5 pb-4 flex flex-col gap-5">

        {/* ── MODE TOGGLE ──────────────────────────────────────────────────── */}
        <div className="flex bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-1 gap-1">
          {(['remaining', 'consumed'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2 text-xs font-bold rounded-[var(--radius-md)] transition-all ${
                mode === m
                  ? 'bg-[var(--color-lime)] text-[#0D0F0E]'
                  : 'text-[var(--color-muted)]'
              }`}>
              {m === 'remaining' ? 'What I have left' : 'What I have eaten'}
            </button>
          ))}
        </div>

        {/* ── MACRO INPUT ──────────────────────────────────────────────────── */}
        <div className="flex gap-2.5">
          {/* Calories */}
          <div className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] px-4 pt-3.5 pb-3 relative">
            <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-muted)] block mb-1">
              {mode === 'remaining' ? 'Calories left' : 'Calories eaten'}
            </label>
            <input
              type="number" inputMode="numeric"
              placeholder={mode === 'remaining' ? '500' : '1500'}
              value={calories}
              onChange={e => setCalories(e.target.value)}
              className="w-full bg-transparent text-[2.2rem] font-black text-[var(--color-text)] focus:outline-none tabular-nums leading-none"
            />
            <span className="text-xs text-[var(--color-subtle)] mt-1 block">kcal</span>
            {mode === 'consumed' && calNum > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-[var(--radius-xl)] overflow-hidden">
                <div className="h-full transition-all" style={{
                  width: `${calPct}%`,
                  background: calPct > 90 ? 'var(--color-warn)' : 'var(--color-lime)',
                }} />
              </div>
            )}
          </div>

          {/* Protein */}
          <div className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-[var(--radius-xl)] px-4 pt-3.5 pb-3">
            <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-muted)] block mb-1">
              {mode === 'remaining' ? 'Protein left' : 'Protein eaten'}
            </label>
            <input
              type="number" inputMode="decimal"
              placeholder={mode === 'remaining' ? '60' : '90'}
              value={protein}
              onChange={e => setProtein(e.target.value)}
              className="w-full bg-transparent text-[2.2rem] font-black text-[var(--color-lime)] focus:outline-none tabular-nums leading-none"
            />
            <span className="text-xs text-[var(--color-subtle)] mt-1 block">grams</span>
          </div>
        </div>

        {/* Quick target reminder */}
        <div className="flex items-center justify-between px-1 -mt-2">
          <span className="text-[11px] text-[var(--color-subtle)]">Target: {targets.calories.toLocaleString()} kcal · {targets.protein_target}g protein</span>
          <a href="/more/settings" className="text-[11px] text-[var(--color-accent-dark)] font-semibold">Edit</a>
        </div>

        {/* Optional carbs/fat */}
        <button onClick={() => setShowOptional(!showOptional)}
          className="text-xs font-semibold text-[var(--color-muted)] flex items-center gap-1 -mt-1">
          {showOptional ? '↑ Hide' : '+'} carbs &amp; fat
        </button>
        {showOptional && (
          <div className="flex gap-2.5 -mt-3">
            {[{ label: 'Carbs', val: carbs, set: setCarbs }, { label: 'Fat', val: fat, set: setFat }].map(f => (
              <div key={f.label} className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] px-3 pt-2.5 pb-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-muted)] block mb-1">{f.label}</label>
                <input type="number" inputMode="decimal" placeholder="g" value={f.val}
                  onChange={e => f.set(e.target.value)}
                  className="w-full bg-transparent text-xl font-black text-[var(--color-text)] focus:outline-none tabular-nums" />
              </div>
            ))}
          </div>
        )}

        {/* ── SITUATION ────────────────────────────────────────────────────── */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-subtle)] mb-2">What fits today?</p>
          <div className="flex flex-wrap gap-1.5">
            {SITUATIONS.map(s => (
              <button key={s.value} onClick={() => setSituation(s.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  situation === s.value
                    ? 'bg-[var(--color-lime)] text-[#0D0F0E] border-[var(--color-lime)]'
                    : 'bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)]'
                }`}>{s.label}</button>
            ))}
          </div>
        </div>

        {/* ── MEAL TIME ────────────────────────────────────────────────────── */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-subtle)] mb-2">
            Meal time <span className="normal-case font-normal">(optional)</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {MEAL_TIMES.map(m => (
              <button key={m.value} onClick={() => setMealTime(mealTime === m.value ? null : m.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  mealTime === m.value
                    ? 'bg-[var(--color-surface-raised)] border-[var(--color-border-strong)] text-[var(--color-text)]'
                    : 'bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)]'
                }`}>{m.label}</button>
            ))}
          </div>
        </div>

        {/* ── STORE ────────────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-subtle)]">Store</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[var(--color-subtle)]">Nearby only</span>
              <button onClick={() => setNearbyOnly(!nearbyOnly)}
                className={`w-8 h-4 rounded-full relative transition-colors ${nearbyOnly ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border-strong)]'}`}>
                <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${nearbyOnly ? 'left-[18px]' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {STORES.filter(s => nearbyOnly ? ['any_nearby','coop','migros'].includes(s.value) : true).map(s => (
              <button key={s.value} onClick={() => setStore(s.value)}
                className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-[var(--radius-lg)] border-2 transition-all ${
                  store === s.value
                    ? 'border-[var(--color-lime)] bg-[var(--color-lime-dim)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)]'
                }`}>
                {s.value === 'any_nearby'
                  ? <span className="text-base">📍</span>
                  : <StoreLogoByName store={s.value} size={20} />}
                <span className={`text-[8px] font-bold ${store === s.value ? 'text-[var(--color-lime)]' : 'text-[var(--color-subtle)]'}`}>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── FILTERS (collapsible) ─────────────────────────────────────────── */}
        <button onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-between w-full text-[10px] font-bold uppercase tracking-widest text-[var(--color-subtle)]">
          <span>More filters</span>
          <span>{showFilters ? '▲' : '▼'}</span>
        </button>

        {showFilters && (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4 flex flex-col gap-4 -mt-3">
            {/* Budget */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-subtle)] mb-2">Budget</p>
              <div className="flex gap-2">
                {['8','10','15','20'].map(b => (
                  <button key={b} onClick={() => setBudget(b)}
                    className={`flex-1 py-2 rounded-[var(--radius-md)] text-xs font-bold border transition-all ${
                      budget === b
                        ? 'bg-[var(--color-lime)] text-[#0D0F0E] border-[var(--color-lime)]'
                        : 'bg-[var(--color-surface-raised)] text-[var(--color-muted)] border-[var(--color-border)]'
                    }`}>CHF {b}</button>
                ))}
              </div>
            </div>

            {/* Prep time */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-subtle)] mb-2">Prep time</p>
              <div className="flex gap-1.5 flex-wrap">
                {TIME_FILTERS.map(t => (
                  <button key={t.value} onClick={() => setTimeFilter(t.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      timeFilter === t.value
                        ? 'bg-[var(--color-lime)] text-[#0D0F0E] border-[var(--color-lime)]'
                        : 'bg-[var(--color-surface-raised)] text-[var(--color-muted)] border-[var(--color-border)]'
                    }`}>{t.label}</button>
                ))}
              </div>
            </div>

            {/* Max protein */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[var(--color-text)]">Prioritise protein/calorie ratio</p>
                <p className="text-[11px] text-[var(--color-subtle)]">Show most protein-efficient options first</p>
              </div>
              <button onClick={() => setMaxProtein(!maxProtein)}
                className={`w-9 h-5 rounded-full relative flex-shrink-0 transition-colors ${maxProtein ? 'bg-[var(--color-lime)]' : 'bg-[var(--color-border-strong)]'}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${maxProtein ? 'left-[18px]' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        )}

        {/* ── RECENT ───────────────────────────────────────────────────────── */}
        {(recentRecipes as Record<string,unknown>[]).length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-subtle)] mb-2">Your usual options</p>
            <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-4 px-4 snap-x snap-mandatory">
              {(recentRecipes as Record<string,unknown>[]).map(r => (
                <a key={String(r.id)} href={`/recipe/${r.id}`}
                  className="flex-shrink-0 snap-start bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-3.5 w-44">
                  <p className="text-sm font-bold text-[var(--color-text)] line-clamp-2 mb-1.5">{String(r.name)}</p>
                  <p className="text-xs text-[var(--color-lime)] font-bold">{Math.round(Number(r.total_protein))}g protein</p>
                  <p className="text-[11px] text-[var(--color-subtle)]">{Math.round(Number(r.total_calories))} kcal</p>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <div className="sticky bottom-[calc(64px+env(safe-area-inset-bottom))] bg-[var(--color-bg)] border-t border-[var(--color-border)] px-4 py-3 z-20">
        <button onClick={handleSubmit} disabled={!hasInput}
          className={`w-full h-13 rounded-[var(--radius-lg)] text-base font-black transition-all ${
            hasInput
              ? 'bg-[var(--color-lime)] text-[#0D0F0E] shadow-lg active:scale-[0.98]'
              : 'bg-[var(--color-surface)] text-[var(--color-subtle)] cursor-not-allowed'
          }`}>
          {hasInput ? 'Show me what fits →' : 'Enter calories and protein above'}
        </button>
      </div>
    </div>
  )
}
