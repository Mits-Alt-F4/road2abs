'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChipGroup } from '@/components/ui/Chip'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { formatDate, greeting, chf } from '@/lib/utils/format'
import type { NutritionTargets, MealContext, MealTime, Store, TimeFilter } from '@/types'

const SITUATIONS: { value: MealContext; label: string; icon: string }[] = [
  { value: 'meal', label: 'Meal', icon: '🍽️' },
  { value: 'snack', label: 'Snack', icon: '⚡' },
  { value: 'sweet', label: 'Sweet', icon: '🍫' },
  { value: 'no_cooking', label: 'No cooking', icon: '🥶' },
  { value: 'emergency_protein', label: 'Emergency protein', icon: '🆘' },
  { value: 'meal_prep', label: 'Meal prep', icon: '📦' },
]

const MEAL_TIMES: { value: MealTime; label: string }[] = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'late_night', label: 'Late night' },
  { value: 'post_gym', label: 'Post gym' },
]

const STORES: { value: Store | 'any_nearby'; label: string; color: string }[] = [
  { value: 'coop', label: 'Coop', color: '#e31e26' },
  { value: 'migros', label: 'Migros', color: '#ff6600' },
  { value: 'any_nearby', label: 'Either nearby', color: '#3a6235' },
  { value: 'lidl', label: 'Lidl', color: '#0050aa' },
  { value: 'denner', label: 'Denner', color: '#cc0000' },
]

const TIME_FILTERS: { value: TimeFilter; label: string }[] = [
  { value: 'none', label: 'No cooking' },
  { value: 'under_10', label: '< 10 min' },
  { value: 'under_20', label: '< 20 min' },
  { value: 'any', label: 'Any time' },
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
      <header className="safe-top bg-[var(--color-bg)] sticky top-0 z-30 px-4 pb-3 pt-[max(12px,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-black tracking-tight text-[var(--color-text)]">
            road<span className="text-[var(--color-accent)]">2</span>abs
          </h1>
          <a href="/more/settings" className="w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-sm font-bold text-[var(--color-muted)]">
            ⚙
          </a>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[var(--color-subtle)] text-sm font-medium">{formatDate()}</p>
          <p className="text-[var(--color-muted)] text-sm font-semibold">{greeting()}</p>
        </div>
      </header>

      <div className="flex-1 px-4 pb-6 flex flex-col gap-4">

        {/* Daily targets card */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wide">Daily targets</h2>
            <a href="/more/settings" className="text-xs text-[var(--color-accent)] font-semibold">Edit</a>
          </div>
          <div className="flex gap-6 mb-3">
            <div>
              <div className="text-2xl font-black tabular-nums text-[var(--color-text)]">
                {targets.calories.toLocaleString()}
              </div>
              <div className="text-xs text-[var(--color-subtle)] font-medium uppercase tracking-wide">kcal / day</div>
            </div>
            <div className="w-px bg-[var(--color-border)]" />
            <div>
              <div className="text-2xl font-black tabular-nums text-[var(--color-accent)]">
                {targets.protein_target}g
              </div>
              <div className="text-xs text-[var(--color-subtle)] font-medium uppercase tracking-wide">
                protein target
              </div>
            </div>
          </div>
          <div className="flex gap-2 text-xs text-[var(--color-subtle)] font-medium">
            <span>Min {targets.protein_min}g</span>
            <span>·</span>
            <span>Target {targets.protein_target}g</span>
            <span>·</span>
            <span>Upper {targets.protein_max}g</span>
          </div>
          {mode === 'consumed' && calNum > 0 && (
            <div className="mt-3">
              <ProgressBar value={calNum} max={targets.calories} variant={calPct > 90 ? 'warn' : 'accent'} />
              <div className="text-xs text-[var(--color-subtle)] mt-1">{Math.round(calPct)}% of daily calories consumed</div>
            </div>
          )}
        </Card>

        {/* Input mode toggle */}
        <div className="flex rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-border)] p-1">
          {(['remaining', 'consumed'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-[var(--radius-sm)] transition-all ${
                mode === m
                  ? 'bg-[var(--color-accent)] text-white shadow-sm'
                  : 'text-[var(--color-muted)]'
              }`}
            >
              {m === 'remaining' ? 'I have left…' : 'I have eaten…'}
            </button>
          ))}
        </div>

        {/* Macro inputs */}
        <Card padding="md">
          <h2 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wide mb-3">
            {mode === 'remaining' ? 'What I have left today' : 'What I have eaten today'}
          </h2>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <Input
                label="Calories"
                type="number"
                inputMode="numeric"
                placeholder={mode === 'remaining' ? '500' : '1500'}
                unit="kcal"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Input
                label="Protein"
                type="number"
                inputMode="decimal"
                placeholder={mode === 'remaining' ? '60' : '90'}
                unit="g"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
              />
            </div>
          </div>

          {remCal > 0 && remPro > 0 && (
            <div className="bg-[var(--color-accent-light)] rounded-[var(--radius-md)] px-3 py-2 mb-3 flex gap-4 text-sm">
              <span className="font-semibold text-[var(--color-accent-dark)]">
                {Math.round(remCal)} kcal remaining
              </span>
              <span className="text-[var(--color-accent)]">·</span>
              <span className="font-semibold text-[var(--color-accent-dark)]">
                {Math.round(remPro)}g protein needed
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowOptional(!showOptional)}
            className="text-xs text-[var(--color-accent)] font-semibold flex items-center gap-1"
          >
            {showOptional ? '− Hide' : '+ Add'} carbs &amp; fat
          </button>

          {showOptional && (
            <div className="flex gap-3 mt-3">
              <div className="flex-1">
                <Input
                  label="Carbs"
                  type="number"
                  inputMode="decimal"
                  placeholder="g"
                  unit="g"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Input
                  label="Fat"
                  type="number"
                  inputMode="decimal"
                  placeholder="g"
                  unit="g"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Situation chips */}
        <Card padding="md">
          <h2 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wide mb-3">What are you after?</h2>
          <div className="flex flex-wrap gap-2">
            {SITUATIONS.map((s) => (
              <button
                key={s.value}
                onClick={() => setSituation(situation === s.value ? null : s.value)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-all ${
                  situation === s.value
                    ? 'bg-[var(--color-accent)] text-white shadow-sm'
                    : 'bg-stone-100 text-[var(--color-muted)] hover:bg-[var(--color-accent-light)] hover:text-[var(--color-accent-dark)]'
                }`}
              >
                <span>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Meal time chips */}
        <Card padding="md">
          <h2 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wide mb-3">Meal time <span className="text-[var(--color-subtle)] normal-case font-normal">(optional)</span></h2>
          <div className="flex flex-wrap gap-2">
            {MEAL_TIMES.map((m) => (
              <button
                key={m.value}
                onClick={() => setMealTime(mealTime === m.value ? null : m.value)}
                className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all ${
                  mealTime === m.value
                    ? 'bg-stone-800 text-white'
                    : 'bg-stone-100 text-[var(--color-muted)] hover:bg-stone-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Store selection */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wide">Store</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--color-subtle)]">Nearby only</span>
              <button
                onClick={() => setNearbyOnly(!nearbyOnly)}
                className={`w-9 h-5 rounded-full transition-colors ${nearbyOnly ? 'bg-[var(--color-accent)]' : 'bg-stone-200'} relative`}
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
                className={`py-3 px-4 rounded-[var(--radius-md)] text-sm font-bold transition-all border-2 ${
                  store === s.value
                    ? 'text-white border-transparent shadow-md'
                    : 'bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-accent-light)]'
                }`}
                style={store === s.value ? { backgroundColor: s.color, borderColor: s.color } : {}}
              >
                {s.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Filters (collapsible) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-between w-full text-sm font-semibold text-[var(--color-muted)] px-1"
        >
          <span>Filters</span>
          <span className="text-[var(--color-subtle)]">{showFilters ? '▲' : '▼'}</span>
        </button>

        {showFilters && (
          <Card padding="md" className="flex flex-col gap-4">
            {/* Budget */}
            <Input
              label="Budget"
              type="number"
              inputMode="decimal"
              unit="CHF"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="10"
            />
            {/* Time */}
            <div>
              <label className="text-sm font-semibold text-[var(--color-text)] mb-2 block">Prep time</label>
              <div className="flex flex-wrap gap-2">
                {TIME_FILTERS.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTimeFilter(t.value)}
                    className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all ${
                      timeFilter === t.value
                        ? 'bg-[var(--color-accent)] text-white'
                        : 'bg-stone-100 text-[var(--color-muted)]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Max protein efficiency */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-[var(--color-text)]">Maximum protein efficiency</div>
                <div className="text-xs text-[var(--color-subtle)]">Prioritise most protein per calorie</div>
              </div>
              <button
                onClick={() => setMaxProtein(!maxProtein)}
                className={`w-9 h-5 rounded-full transition-colors ${maxProtein ? 'bg-[var(--color-accent)]' : 'bg-stone-200'} relative flex-shrink-0`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${maxProtein ? 'left-[18px]' : 'left-0.5'}`} />
              </button>
            </div>
          </Card>
        )}

        {/* Recent meals */}
        {(recentRecipes as Record<string, unknown>[]).length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wide mb-3 px-1">Your usual options</h2>
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 snap-x snap-mandatory">
              {(recentRecipes as Record<string, unknown>[]).map((r) => (
                <a
                  key={String(r.id)}
                  href={`/recipe/${r.id}`}
                  className="flex-shrink-0 snap-start bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4 w-48 flex flex-col gap-2"
                >
                  <div className="text-sm font-bold text-[var(--color-text)] line-clamp-2">{String(r.name)}</div>
                  <div className="text-xs text-[var(--color-accent)] font-semibold">
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
          size="xl"
          fullWidth
          onClick={handleSubmit}
          disabled={!hasInput}
          className="shadow-lg shadow-[var(--color-accent)]/20"
        >
          Show me what fits →
        </Button>
        {!hasInput && (
          <p className="text-xs text-center text-[var(--color-subtle)] mt-2">
            Enter your remaining calories and protein to continue
          </p>
        )}
      </div>
    </div>
  )
}
