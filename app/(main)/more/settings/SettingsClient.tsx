'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'
import type { NutritionTargets, CookingEquipment } from '@/types'

const EQUIPMENT_OPTIONS: { value: CookingEquipment; label: string; emoji: string }[] = [
  { value: 'pan', label: 'Pan / stove', emoji: '🍳' },
  { value: 'oven', label: 'Oven', emoji: '♨️' },
  { value: 'air_fryer', label: 'Air fryer', emoji: '🔥' },
  { value: 'microwave', label: 'Microwave', emoji: '📡' },
  { value: 'blender', label: 'Blender', emoji: '🧃' },
  { value: 'sandwich_press', label: 'Sandwich press', emoji: '🥪' },
  { value: 'grill', label: 'Grill', emoji: '🥩' },
  { value: 'shaker', label: 'Protein shaker', emoji: '🥤' },
]

const DEFAULT_EQUIPMENT: CookingEquipment[] = ['pan', 'oven', 'air_fryer', 'microwave', 'blender', 'sandwich_press', 'grill', 'shaker']

interface Props {
  userId: string
  email: string
  targets: NutritionTargets | null
  profile: Record<string, unknown> | null
}

export function SettingsClient({ userId, email, targets, profile }: Props) {
  const supabase = createClient()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [calories, setCalories] = useState(String(targets?.calories ?? 2070))
  const [proteinMin, setProteinMin] = useState(String(targets?.protein_min ?? 130))
  const [proteinTarget, setProteinTarget] = useState(String(targets?.protein_target ?? 160))
  const [proteinMax, setProteinMax] = useState(String(targets?.protein_max ?? 180))
  const [budget, setBudget] = useState(String((profile?.default_budget as number) ?? 10))
  const [equipment, setEquipment] = useState<Set<CookingEquipment>>(
    new Set(((profile?.equipment as CookingEquipment[]) ?? DEFAULT_EQUIPMENT))
  )

  function toggleEquip(e: CookingEquipment) {
    setEquipment((prev) => {
      const n = new Set(prev)
      if (n.has(e)) n.delete(e)
      else n.add(e)
      return n
    })
  }

  async function save() {
    setSaving(true)
    await supabase.from('nutrition_targets').upsert({
      user_id: userId,
      calories: parseInt(calories),
      protein_min: parseInt(proteinMin),
      protein_target: parseInt(proteinTarget),
      protein_max: parseInt(proteinMax),
    }, { onConflict: 'user_id' })

    await supabase.from('profiles').upsert({
      user_id: userId,
      default_budget: parseFloat(budget),
      equipment: [...equipment],
    }, { onConflict: 'user_id' })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">
      <header className="safe-top sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 pt-[max(16px,env(safe-area-inset-top))] pb-3 flex items-center gap-3">
        <a href="/more" className="w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-lg text-[var(--color-muted)]">←</a>
        <div className="flex-1">
          <h1 className="text-xl font-black text-[var(--color-text)]">⚙️ Settings</h1>
          <p className="text-xs text-[var(--color-subtle)] truncate">{email}</p>
        </div>
      </header>

      <div className="px-4 py-4 flex flex-col gap-4">

        {/* Targets */}
        <Card padding="md">
          <h2 className="font-bold text-[var(--color-text)] mb-3">Daily nutrition targets</h2>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Daily calories" type="number" inputMode="numeric" unit="kcal" value={calories} onChange={(e) => setCalories(e.target.value)} />
            <Input label="Protein target" hint="central goal" type="number" inputMode="numeric" unit="g" value={proteinTarget} onChange={(e) => setProteinTarget(e.target.value)} />
            <Input label="Protein minimum" type="number" inputMode="numeric" unit="g" value={proteinMin} onChange={(e) => setProteinMin(e.target.value)} />
            <Input label="Protein upper" hint="preferred max" type="number" inputMode="numeric" unit="g" value={proteinMax} onChange={(e) => setProteinMax(e.target.value)} />
          </div>
          <p className="text-xs text-[var(--color-subtle)] mt-2">
            The upper limit is a preferred range, not a strict cap.
          </p>
        </Card>

        {/* Budget */}
        <Card padding="md">
          <h2 className="font-bold text-[var(--color-text)] mb-3">Shopping preferences</h2>
          <Input label="Default meal budget" type="number" inputMode="decimal" unit="CHF" value={budget} onChange={(e) => setBudget(e.target.value)} />
        </Card>

        {/* Equipment */}
        <Card padding="md">
          <h2 className="font-bold text-[var(--color-text)] mb-3">Equipment at home</h2>
          <div className="grid grid-cols-2 gap-2">
            {EQUIPMENT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggleEquip(opt.value)}
                className={`flex items-center gap-2 p-3 rounded-[var(--radius-md)] border-2 text-sm font-semibold text-left transition-all ${
                  equipment.has(opt.value)
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-light)] text-[var(--color-accent-dark)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]'
                }`}
              >
                <span>{opt.emoji}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </Card>

        <Button size="lg" fullWidth onClick={save} disabled={saving}>
          {saved ? '✓ Saved!' : saving ? 'Saving…' : 'Save settings'}
        </Button>

        <Card padding="md">
          <h2 className="font-bold text-[var(--color-text)] mb-3">Account</h2>
          <Button variant="ghost" size="md" onClick={signOut} className="text-[var(--color-danger)]">
            Sign out
          </Button>
        </Card>
      </div>
    </div>
  )
}
