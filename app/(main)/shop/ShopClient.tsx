'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { StoreLogoByName } from '@/components/ui/StoreLogo'
import type { NutritionTargets, Store } from '@/types'

const STORES: { value: Store; label: string }[] = [
  { value: 'coop', label: 'Coop' },
  { value: 'migros', label: 'Migros' },
  { value: 'lidl', label: 'Lidl' },
  { value: 'denner', label: 'Denner' },
]

const DEFAULT_TARGETS = { calories: 2070, protein_min: 130, protein_target: 160, protein_max: 180 }

export function ShopClient({ targets }: { targets: NutritionTargets | null }) {
  const router = useRouter()
  const t = targets ?? DEFAULT_TARGETS
  const [store, setStore] = useState<Store | null>(null)
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [budget, setBudget] = useState('10')
  const [mode, setMode] = useState<'no_cooking' | 'quick' | 'ingredients'>('no_cooking')

  function go() {
    const params = new URLSearchParams({
      calories,
      protein,
      situation: mode === 'no_cooking' ? 'no_cooking' : mode === 'quick' ? 'snack' : 'meal',
      store: store ?? 'any_nearby',
      nearby_only: String(store === 'coop' || store === 'migros'),
      budget,
      time_filter: mode === 'no_cooking' ? 'none' : mode === 'quick' ? 'under_10' : 'any',
      max_protein: 'false',
    })
    router.push(`/results?${params.toString()}`)
  }

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">
      <header className="safe-top sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 pt-[max(16px,env(safe-area-inset-top))] pb-3">
        <h1 className="text-2xl font-black text-[var(--color-text)]">I&apos;m at the supermarket</h1>
        <p className="text-sm text-[var(--color-subtle)] font-medium mt-0.5">Fast mode for in-store decisions</p>
      </header>

      <div className="px-4 py-4 flex flex-col gap-4">

        {/* Store selector — big tap targets with real logos */}
        <div className="grid grid-cols-2 gap-3">
          {STORES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStore(store === s.value ? null : s.value)}
              className={`flex flex-col items-center justify-center py-5 rounded-[var(--radius-xl)] border-2 transition-all active:scale-[0.97] ${
                store === s.value
                  ? 'border-[var(--color-lime)] bg-[var(--color-surface-raised)]'
                  : 'bg-[var(--color-surface)] border-[var(--color-border)]'
              }`}
            >
              <div className="mb-2">
                <StoreLogoByName store={s.value} size={36} />
              </div>
              <span className={`text-sm font-bold ${store === s.value ? 'text-[var(--color-lime)]' : 'text-[var(--color-muted)]'}`}>
                {s.label}
              </span>
            </button>
          ))}
        </div>

        {/* Quick inputs */}
        <Card padding="md">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--color-text)] mb-3">What do you have left?</h2>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <Input
                label="Calories"
                type="number"
                inputMode="numeric"
                placeholder={String(Math.round(t.calories * 0.35))}
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
                placeholder={String(Math.round(t.protein_target * 0.4))}
                unit="g"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
              />
            </div>
          </div>
          <Input
            label="Budget"
            type="number"
            inputMode="decimal"
            unit="CHF"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="10"
          />
        </Card>

        {/* What kind */}
        <Card padding="md">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--color-text)] mb-3">Looking for…</h2>
          <div className="flex flex-col gap-2">
            {([
              { value: 'no_cooking', label: 'Ready to eat — no cooking', desc: 'Grab and go' },
              { value: 'quick', label: 'Quick meal — under 10 min', desc: 'Simple prep at home' },
              { value: 'ingredients', label: 'Ingredients for home', desc: 'Cook a proper meal' },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setMode(opt.value)}
                className={`w-full flex items-center gap-3 p-3 rounded-[var(--radius-md)] border-2 text-left transition-all ${
                  mode === opt.value
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-light)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${mode === opt.value ? 'border-[var(--color-accent)] bg-[var(--color-accent)]' : 'border-[var(--color-border)]'}`} />
                <div>
                  <div className={`text-sm font-semibold ${mode === opt.value ? 'text-[var(--color-accent-dark)]' : 'text-[var(--color-text)]'}`}>{opt.label}</div>
                  <div className="text-xs text-[var(--color-subtle)]">{opt.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Button
          size="xl"
          fullWidth
          onClick={go}
          disabled={!calories || !protein}
          className="shadow-lg shadow-[var(--color-accent)]/20"
        >
          Show best options →
        </Button>
      </div>
    </div>
  )
}
