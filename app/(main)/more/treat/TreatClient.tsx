'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { MacroRow } from '@/components/ui/MacroTag'
import { StoreBadge } from '@/components/ui/Badge'
import type { NutritionTargets } from '@/types'

const DEFAULT_TARGETS = { calories: 2070, protein_min: 130, protein_target: 160, protein_max: 180 }

interface Product {
  id: string
  name: string
  store: string
  calories_per_package: number
  protein_per_package: number
  price_chf: number
}

interface Props {
  targets: NutritionTargets | null
  treats: Product[]
  userId: string
}

const COMMON_TREATS = [
  { name: 'Milka Oreo 100g', calories: 503, protein: 6, fat: 26, carbs: 63 },
  { name: 'Raclette du Valais 30g', calories: 115, protein: 7.5, fat: 9, carbs: 0.5 },
  { name: 'Lindt 70% Dark 40g', calories: 228, protein: 2.8, fat: 17.6, carbs: 14.4 },
  { name: 'Migros Glacé Vanille', calories: 198, protein: 3.2, fat: 8, carbs: 29 },
  { name: 'Zweifel Chips 40g', calories: 215, protein: 2.5, fat: 14, carbs: 20 },
  { name: 'Mars 51g bar', calories: 228, protein: 2, fat: 9, carbs: 35 },
]

export function TreatClient({ targets, treats }: Props) {
  const router = useRouter()
  const t = targets ?? DEFAULT_TARGETS

  const [remainingCal, setRemainingCal] = useState('')
  const [remainingPro, setRemainingPro] = useState('')
  const [treatCal, setTreatCal] = useState('')
  const [treatPro, setTreatPro] = useState('')
  const [treatName, setTreatName] = useState('')
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const remCalNum = parseFloat(remainingCal) || 0
  const remProNum = parseFloat(remainingPro) || 0
  const treatCalNum = parseFloat(treatCal) || 0
  const treatProNum = parseFloat(treatPro) || 0

  const calAfterTreat = remCalNum - treatCalNum
  const proAfterTreat = remProNum - treatProNum
  const treatFits = calAfterTreat >= 150

  function pickPreset(i: number) {
    setSelectedPreset(i)
    setSelectedProduct(null)
    setTreatName(COMMON_TREATS[i].name)
    setTreatCal(String(COMMON_TREATS[i].calories))
    setTreatPro(String(COMMON_TREATS[i].protein))
  }

  function pickProduct(p: Product) {
    setSelectedProduct(p)
    setSelectedPreset(null)
    setTreatName(p.name)
    setTreatCal(String(p.calories_per_package))
    setTreatPro(String(p.protein_per_package))
  }

  function findMealCombo() {
    const params = new URLSearchParams({
      calories: String(Math.max(0, calAfterTreat)),
      protein: String(Math.max(0, proAfterTreat)),
      situation: 'meal',
      store: 'any_nearby',
      nearby_only: 'false',
      budget: '10',
      time_filter: 'any',
      max_protein: 'true',
    })
    router.push(`/results?${params.toString()}`)
  }

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">
      <header className="safe-top sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 pt-[max(16px,env(safe-area-inset-top))] pb-3 flex items-center gap-3">
        <a href="/more" className="w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-lg text-[var(--color-muted)]">←</a>
        <div>
          <h1 className="text-xl font-black text-[var(--color-text)]">🍫 Make a treat fit</h1>
          <p className="text-xs text-[var(--color-subtle)]">Find a meal combo that includes your treat</p>
        </div>
      </header>

      <div className="px-4 py-4 flex flex-col gap-4">

        {/* Remaining macros */}
        <Card padding="md">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--color-text)] mb-3">What I have left today</h2>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                label="Calories left"
                type="number"
                inputMode="numeric"
                placeholder="700"
                unit="kcal"
                value={remainingCal}
                onChange={(e) => setRemainingCal(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Input
                label="Protein left"
                type="number"
                inputMode="decimal"
                placeholder="50"
                unit="g"
                value={remainingPro}
                onChange={(e) => setRemainingPro(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Pick a treat */}
        <Card padding="md">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--color-text)] mb-3">Your treat</h2>

          {/* Common presets */}
          <div className="flex flex-wrap gap-2 mb-3">
            {COMMON_TREATS.map((c, i) => (
              <button
                key={i}
                onClick={() => pickPreset(i)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedPreset === i
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-stone-100 text-[var(--color-muted)] hover:bg-stone-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Product database treats */}
          {treats.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {treats.map((p) => (
                <button
                  key={p.id}
                  onClick={() => pickProduct(p)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    selectedProduct?.id === p.id
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'bg-stone-100 text-[var(--color-muted)]'
                  }`}
                >
                  <StoreBadge store={p.store} />
                  {p.name}
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-[var(--color-border)] pt-3 mt-1">
            <p className="text-xs text-[var(--color-subtle)] mb-2">Or enter manually:</p>
            <div className="flex gap-2 mb-2">
              <div className="flex-1">
                <Input
                  label="Calories"
                  type="number"
                  inputMode="numeric"
                  unit="kcal"
                  value={treatCal}
                  onChange={(e) => setTreatCal(e.target.value)}
                  placeholder="228"
                />
              </div>
              <div className="flex-1">
                <Input
                  label="Protein"
                  type="number"
                  inputMode="decimal"
                  unit="g"
                  value={treatPro}
                  onChange={(e) => setTreatPro(e.target.value)}
                  placeholder="3"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Result preview */}
        {remCalNum > 0 && treatCalNum > 0 && (
          <Card padding="md" className={treatFits ? 'border-[var(--color-accent)]' : 'border-[var(--color-warn)]'}>
            <h2 className="font-bold text-[var(--color-text)] mb-3">
              {treatFits ? '✓ Your treat fits' : '⚠ Tight, but possible'}
            </h2>
            {treatName && (
              <p className="text-sm text-[var(--color-muted)] mb-3">
                You can fit <strong>{treatName}</strong> ({treatCalNum} kcal, {treatProNum}g protein)
              </p>
            )}
            <div className="bg-stone-50 rounded-[var(--radius-md)] p-3 mb-3">
              <div className="text-sm font-semibold text-[var(--color-text)] mb-1">After eating the treat:</div>
              <MacroRow
                calories={Math.max(0, calAfterTreat)}
                protein={Math.max(0, proAfterTreat)}
                size="sm"
              />
              <div className="text-xs text-[var(--color-subtle)] mt-1">
                remaining for the rest of your day
              </div>
            </div>
            {treatFits && calAfterTreat >= 200 && (
              <Button size="lg" fullWidth onClick={findMealCombo}>
                Find a high-protein meal for {Math.round(calAfterTreat)} kcal →
              </Button>
            )}
            {calAfterTreat < 200 && calAfterTreat > 0 && (
              <p className="text-sm text-[var(--color-muted)] text-center">
                Only {Math.round(calAfterTreat)} kcal left after the treat — probably just a protein snack.
              </p>
            )}
          </Card>
        )}

        <p className="text-xs text-[var(--color-subtle)] px-1">
          Macro values for common products are approximate. Always check the actual packaging.
        </p>
      </div>
    </div>
  )
}
