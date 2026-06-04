'use client'
import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'

interface ProgressEntry {
  id: string
  entry_date: string
  weight_kg: number | null
  energy_level: 'low' | 'okay' | 'good' | null
  hunger_level: 'low' | 'manageable' | 'high' | null
  gym_performance: 'improving' | 'stable' | 'worse' | null
  notes: string | null
}

interface Props {
  entries: ProgressEntry[]
  userId: string
}

export function ProgressPageClient({ entries: initialEntries, userId }: Props) {
  const supabase = createClient()
  const [entries, setEntries] = useState(initialEntries)
  const [showForm, setShowForm] = useState(false)
  const [weight, setWeight] = useState('')
  const [energy, setEnergy] = useState<ProgressEntry['energy_level']>(null)
  const [hunger, setHunger] = useState<ProgressEntry['hunger_level']>(null)
  const [gym, setGym] = useState<ProgressEntry['gym_performance']>(null)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    const { data } = await supabase
      .from('progress_entries')
      .insert({
        user_id: userId,
        entry_date: new Date().toISOString().slice(0, 10),
        weight_kg: weight ? parseFloat(weight) : null,
        energy_level: energy,
        hunger_level: hunger,
        gym_performance: gym,
        notes: notes || null,
      })
      .select()
      .single()

    if (data) {
      setEntries([data, ...entries])
      setWeight('')
      setEnergy(null)
      setHunger(null)
      setGym(null)
      setNotes('')
      setShowForm(false)
    }
    setSaving(false)
  }

  function pattern(): string | null {
    if (entries.length < 2) return null
    const weights = entries.filter((e) => e.weight_kg).map((e) => e.weight_kg!)
    if (weights.length >= 2) {
      const trend = weights[0] - weights[weights.length - 1]
      if (trend < -0.5) return `Weight trend is decreasing over the last ${weights.length} entries.`
      if (trend > 0.5) return `Weight trend is increasing over the last ${weights.length} entries.`
    }
    const lowEnergy = entries.filter((e) => e.energy_level === 'low').length
    if (lowEnergy >= 3) return 'Energy has been low in several recent entries. Review your daily intake with an appropriate professional if this continues.'
    const highHunger = entries.filter((e) => e.hunger_level === 'high').length
    if (highHunger >= 3) return 'Hunger has been high across recent check-ins.'
    return null
  }

  const patternMsg = pattern()

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">
      <header className="safe-top sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 pt-[max(16px,env(safe-area-inset-top))] pb-3 flex items-center gap-3">
        <a href="/more" className="w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-lg text-[var(--color-muted)]">←</a>
        <div className="flex-1">
          <h1 className="text-xl font-black text-[var(--color-text)]">📈 Progress</h1>
          <p className="text-xs text-[var(--color-subtle)]">One weekly check-in is enough to see a useful trend</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Log week'}
        </Button>
      </header>

      <div className="px-4 py-4 flex flex-col gap-4">

        {/* Pattern notice */}
        {patternMsg && (
          <div className="bg-[var(--color-accent-light)] rounded-[var(--radius-lg)] px-4 py-3">
            <p className="text-sm text-[var(--color-accent-dark)] font-medium">{patternMsg}</p>
          </div>
        )}

        {/* Log form */}
        {showForm && (
          <Card padding="md" className="flex flex-col gap-4">
            <h2 className="font-bold text-[var(--color-text)]">This week&apos;s check-in</h2>
            <Input
              label="Body weight"
              type="number"
              inputMode="decimal"
              unit="kg"
              placeholder="72.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)] mb-2">Energy</p>
              <div className="flex gap-2">
                {(['low', 'okay', 'good'] as const).map((e) => (
                  <button key={e} onClick={() => setEnergy(e)} className={`flex-1 py-2 rounded-[var(--radius-md)] text-sm font-semibold capitalize transition-all ${energy === e ? 'bg-[var(--color-accent)] text-white' : 'bg-stone-100 text-[var(--color-muted)]'}`}>{e}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)] mb-2">Hunger</p>
              <div className="flex gap-2">
                {(['low', 'manageable', 'high'] as const).map((h) => (
                  <button key={h} onClick={() => setHunger(h)} className={`flex-1 py-2 rounded-[var(--radius-md)] text-sm font-semibold capitalize transition-all ${hunger === h ? 'bg-[var(--color-accent)] text-white' : 'bg-stone-100 text-[var(--color-muted)]'}`}>{h}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)] mb-2">Gym performance</p>
              <div className="flex gap-2">
                {(['improving', 'stable', 'worse'] as const).map((g) => (
                  <button key={g} onClick={() => setGym(g)} className={`flex-1 py-2 rounded-[var(--radius-md)] text-sm font-semibold capitalize transition-all ${gym === g ? 'bg-[var(--color-accent)] text-white' : 'bg-stone-100 text-[var(--color-muted)]'}`}>{g}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-[var(--color-text)] block mb-1">Notes <span className="font-normal text-[var(--color-subtle)]">(optional)</span></label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything worth noting…"
                rows={2}
                className="w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none"
              />
            </div>
            <Button size="lg" fullWidth onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save check-in'}
            </Button>
          </Card>
        )}

        {/* Entries list */}
        {entries.length === 0 && !showForm ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <div className="text-4xl">📈</div>
            <h3 className="text-base font-bold text-[var(--color-text)]">No entries yet</h3>
            <p className="text-sm text-[var(--color-subtle)] max-w-xs">
              One weekly check-in is enough to see a useful trend over time.
            </p>
          </div>
        ) : (
          entries.map((e) => (
            <Card key={e.id} padding="md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-[var(--color-text)]">
                  {new Date(e.entry_date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </h3>
                {e.weight_kg && (
                  <span className="text-xl font-black text-[var(--color-text)] tabular-nums">{e.weight_kg} kg</span>
                )}
              </div>
              <div className="flex gap-3 flex-wrap">
                {e.energy_level && (
                  <span className="text-xs font-medium text-[var(--color-muted)]">Energy: <strong className="text-[var(--color-text)] capitalize">{e.energy_level}</strong></span>
                )}
                {e.hunger_level && (
                  <span className="text-xs font-medium text-[var(--color-muted)]">Hunger: <strong className="text-[var(--color-text)] capitalize">{e.hunger_level}</strong></span>
                )}
                {e.gym_performance && (
                  <span className="text-xs font-medium text-[var(--color-muted)]">Gym: <strong className="text-[var(--color-text)] capitalize">{e.gym_performance}</strong></span>
                )}
              </div>
              {e.notes && <p className="text-sm text-[var(--color-muted)] mt-2">{e.notes}</p>}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
