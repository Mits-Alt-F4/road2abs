'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { StoreLogoByName } from '@/components/ui/StoreLogo'
import { formatDate, greeting, chf } from '@/lib/utils/format'
import type { NutritionTargets, MealContext, MealTime, Store, TimeFilter } from '@/types'

const SITUATIONS: { value: MealContext; label: string }[] = [
  { value: 'meal', label: 'Full meal' },
  { value: 'snack', label: 'Snack' },
  { value: 'sweet', label: 'Something sweet' },
  { value: 'no_cooking', label: 'No cooking' },
  { value: 'emergency_protein', label: 'Max protein' },
  { value: 'meal_prep', label: 'Meal prep' },
]

const MEAL_TIMES: { value: MealTime; label: string }[] = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'late_night', label: 'Late night' },
  { value: 'post_gym', label: 'Post gym' },
]

const STORES: { value: Store | 'any_nearby'; label: string; color: string; textColor: string }[] = [
  { value: 'any_nearby', label: 'Any nearby', color: '#1c2e1a', textColor: '#4d8046' },
  { value: 'coop', label: 'Coop', color: '#3d0a0a', textColor: '#f87171' },
  { value: 'migros', label: 'Migros', color: '#2a1200', textColor: '#fb923c' },
  { value: 'lidl', label: 'Lidl', color: '#0a1a2e', textColor: '#60a5fa' },
  { value: 'denner', label: 'Denner', color: '#2a0505', textColor: '#f87171' },
]

const TIME_FILTERS: { value: TimeFilter; label: string }[] = [
  { value: 'none', label: 'No cooking' },
  { value: 'under_10', label: '< 10 min' },
  { value: 'under_20', label: '< 20 min' },
  { value: 'any', label: 'Any' },
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
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')
  const [showOptional, setShowOptional] = useState(false)
  const [situation, setSituation] = useState<MealContext | null>('meal')
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

  const calPct = mode === 'consumed' ? Math.min(100, (calNum / targets.calories) * 100) : 0

  function handleSubmit() {
    const params = new URLSearchParams({
      calories: String(remCal),
      protein: String(remPro),
      ...(carbs && { carbs }),
      ...(fat && { fat }),
      situation: situation ?? 'meal',
      ...(mealTime && { meal_time: mealTime }),
      store: store ?? 'any_nearby',
      nearby_only: String(nearbyOnly),
      budget,
      time_filter: timeFilter,
      max_protein: String(maxProtein),
    })
    router.push(`/results?${params.toString()}`)
  }

  const hasInput = calories.length > 0 && protein.length > 0

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">
      {/* Header */}
      <header className="safe-top bg-[var(--color-bg)] sticky top-0 z-30 px-4 pb-3 pt-[max(12px,env(safe-area-inset-top))] border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tight text-[var(--color-text)]">
            road<span className="text-[var(--color-lime)]">2</span>abs
          </h1>
          <div className="flex flex-col items-end">
            <span className="text-xs text-[var(--color-muted)] font-medium">{formatDate()}</span>
            <span className="text-xs text-[var(--color-subtle)]">{greeting()}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 pb-6 flex flex-col gap-5 pt-5">

        {/* Mode toggle */}
        <div className="flex rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] p-1 gap-1">
          {(['remaining', 'consumed'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 text-sm font-bold rounded-[var(--radius-md)] transition-all ${
                mode === m
                  ? 'bg-[var(--color-lime)] text-[#0e0e0e]'
                  : 'text-[var(--color-muted)]'
              }`}
            >
              {m === 'remaining' ? 'I have left' : 'I have eaten'}
            </button>
          ))}
        </div>

        {/* Macro inputs — big and prominent */}
        <div>
          <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-widest mb-3">
            {mode === 'remaining' ? 'What you have left today' : 'What you have eaten today'}
          </p>
          <div className="flex gap-3 mb-2">
            <div className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] mb-1">Calories</div>
              <input
                type="number"
                inputMode="numeric"
                placeholder={mode === 'remaining' ? '500' : '1500'}
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full bg-transparent text-3xl font-black text-[var(--color-text)] placeholder:text-[var(--color-subtle)] focus:outline-none tabular-nums"
              />
              <div className="text-xs text-[var(--color-subtle)] mt-1">kcal</div>
            </div>
            <div className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] mb-1">Protein</div>
              <input
                type="number"
                inputMode="decimal"
                placeholder={mode === 'remaining' ? '60' : '90'}
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full bg-transparent text-3xl font-black text-[var(--color-lime)] placeholder:text-[var(--color-subtle)] focus:outline-none tabular-nums"
              />
              <div className="text-xs text-[var(--color-subtle)] mt-1">grams</div>
            </div>
          </div>

          {remCal > 0 && remPro > 0 && (
            <div className="bg-[var(--color-accent-light)] border border-[var(--color-accent)] border-opacity-30 rounded-[var(--radius-lg)] px-4 py-2.5 flex gap-4 text-sm">
              <span className="font-bold text-[var(--color-text)]">{Math.round(remCal)} kcal</span>
              <span className="text-[var(--color-subtle)]">·</span>
              <span className="font-bold text-[var(--color-lime)]">{Math.round(remPro)}g protein needed</span>
            </div>
          )}

          {mode === 'consumed' && calNum > 0 && (
            <div className="mt-2">
              <div className="h-1.5 rounded-full bg-[var(--color-border)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, calPct)}%`,
                    backgroundColor: calPct > 90 ? 'var(--color-warn)' : 'var(--color-lime)',
                  }}
                />
              </div>
              <div className="text-xs text-[var(--color-subtle)] mt-1">{Math.round(calPct)}% of {targets.calories} kcal target</div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowOptional(!showOptional)}
            className="text-xs text-[var(--color-muted)] font-semibold mt-2 flex items-center gap-1"
          >
            {showOptional ? '− Hide' : '+'} carbs & fat
          </button>

          {showOptional && (
            <div className="flex gap-3 mt-3">
              <div className="flex-1">
                <Input label="Carbs" type="number" inputMode="decimal" placeholder="g" unit="g" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
              </div>
              <div className="flex-1">
                <Input label="Fat" type="number" inputMode="decimal" placeholder="g" unit="g" value={fat} onChange={(e) => setFat(e.target.value)} />
              </div>
            </div>
          )}
        </div>

        {/* What are you after */}
        <div>
          <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-widest mb-3">What are you after?</p>
          <div className="flex flex-wrap gap-2">
            {SITUATIONS.map((s) => (
              <button
                key={s.value}
                onClick={() => setSituation(situation === s.value ? null : s.value)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                  situation === s.value
                    ? 'bg-[var(--color-lime)] text-[#0e0e0e] border-[var(--color-lime)]'
                    : 'bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-border-strong)]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Meal time */}
        <div>
          <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-widest mb-3">
            Meal time <span className="normal-case font-normal">(optional)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {MEAL_TIMES.map((m) => (
              <button
                key={m.value}
                onClick={() => setMealTime(mealTime === m.value ? null : m.value)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                  mealTime === m.value
                    ? 'bg-[var(--color-surface-raised)] text-[var(--color-text)] border-[var(--color-border-strong)]'
                    : 'bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Store */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-widest">Store</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--color-subtle)]">Nearby only</span>
              <button
                onClick={() => setNearbyOnly(!nearbyOnly)}
                className={`w-9 h-5 rounded-full transition-colors relative ${nearbyOnly ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border-strong)]'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${nearbyOnly ? 'left-[18px]' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {STORES.filter((s) => nearbyOnly ? ['coop', 'migros', 'any_nearby'].includes(s.value) : true).map((s) => (
              <button
                key={s.value}
                onClick={() => setStore(s.value)}
                className={`flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-[var(--radius-xl)] transition-all border-2 ${
                  store === s.value
                    ? 'border-[var(--color-lime)] bg-[var(--color-surface-raised)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)]'
                }`}
              >
                {s.value === 'any_nearby'
                  ? <span className="text-xl">📍</span>
                  : <StoreLogoByName store={s.value} size={28} />
                }
                <span className={`text-xs font-bold ${store === s.value ? 'text-[var(--color-lime)]' : 'text-[var(--color-muted)]'}`}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-between w-full text-xs font-semibold text-[var(--color-subtle)] uppercase tracking-widest"
        >
          <span>Filters</span>
          <span>{showFilters ? '▲' : '▼'}</span>
        </button>

        {showFilters && (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4 flex flex-col gap-4">
            <Input label="Budget" type="number" inputMode="decimal" unit="CHF" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="10" />
            <div>
              <label className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-widest mb-2 block">Prep time</label>
              <div className="flex flex-wrap gap-2">
                {TIME_FILTERS.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTimeFilter(t.value)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                      timeFilter === t.value
                        ? 'bg-[var(--color-lime)] text-[#0e0e0e] border-[var(--color-lime)]'
                        : 'bg-[var(--color-surface-raised)] text-[var(--color-muted)] border-[var(--color-border)]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-[var(--color-text)]">Max protein efficiency</div>
                <div className="text-xs text-[var(--color-subtle)]">Most protein per calorie</div>
              </div>
              <button
                onClick={() => setMaxProtein(!maxProtein)}
                className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${maxProtein ? 'bg-[var(--color-lime)]' : 'bg-[var(--color-border-strong)]'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${maxProtein ? 'left-[18px]' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        )}

        {/* Recent meals */}
        {(recentRecipes as Record<string, unknown>[]).length > 0 && (
          <div>
            <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-widest mb-3">Your usual options</p>
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 snap-x snap-mandatory">
              {(recentRecipes as Record<string, unknown>[]).map((r) => (
                <a
                  key={String(r.id)}
                  href={`/recipe/${r.id}`}
                  className="flex-shrink-0 snap-start bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4 w-48 flex flex-col gap-2"
                >
                  <div className="text-sm font-bold text-[var(--color-text)] line-clamp-2">{String(r.name)}</div>
                  <div className="text-xs text-[var(--color-lime)] font-bold">
                    {Math.round(Number(r.total_protein))}g protein · {Math.round(Number(r.total_calories))} kcal
                  </div>
                  <div className="text-xs text-[var(--color-subtle)]">{chf(Number(r.estimated_price_chf))}</div>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-[calc(72px+env(safe-area-inset-bottom))] bg-[var(--color-bg)] border-t border-[var(--color-border)] px-4 py-3 z-20">
        <Button
          variant="lime"
          size="xl"
          fullWidth
          onClick={handleSubmit}
          disabled={!hasInput}
          className="shadow-lg shadow-[var(--color-lime)]/20"
        >
          Show me what fits →
        </Button>
        {!hasInput && (
          <p className="text-xs text-center text-[var(--color-subtle)] mt-2">
            Enter your remaining calories and protein
          </p>
        )}
      </div>
    </div>
  )
}
