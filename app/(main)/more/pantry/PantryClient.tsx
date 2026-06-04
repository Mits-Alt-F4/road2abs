'use client'
import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { StoreBadge } from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase/client'

interface Product {
  id: string
  name: string
  brand: string | null
  store: string
  category: string
}

interface Props {
  products: Product[]
  availableIds: string[]
  userId: string
}

const CATEGORY_LABELS: Record<string, string> = {
  chicken: 'Chicken', minced_meat: 'Minced meat', fish: 'Fish/tuna', eggs: 'Eggs',
  skyr: 'Skyr', yoghurt: 'Yoghurt', quark: 'Quark', cottage_cheese: 'Cottage cheese',
  protein_drink: 'Protein drinks', rice: 'Rice', pasta: 'Pasta', wraps: 'Wraps',
  deli_slices: 'Deli slices',
}

export function PantryClient({ products, availableIds, userId }: Props) {
  const supabase = createClient()
  const [available, setAvailable] = useState(new Set(availableIds))

  async function toggle(productId: string) {
    const nowAvailable = !available.has(productId)
    await supabase.from('pantry_items').upsert(
      { user_id: userId, product_id: productId, available: nowAvailable },
      { onConflict: 'user_id,product_id' }
    )
    setAvailable((prev) => {
      const n = new Set(prev)
      if (nowAvailable) n.add(productId)
      else n.delete(productId)
      return n
    })
  }

  const grouped = products.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {} as Record<string, Product[]>)

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">
      <header className="safe-top sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 pt-[max(16px,env(safe-area-inset-top))] pb-3 flex items-center gap-3">
        <a href="/more" className="w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-lg text-[var(--color-muted)]">←</a>
        <div>
          <h1 className="text-xl font-black text-[var(--color-text)]">🧺 My pantry</h1>
          <p className="text-xs text-[var(--color-subtle)]">
            {available.size} item{available.size !== 1 ? 's' : ''} marked as available
          </p>
        </div>
      </header>

      <div className="px-4 py-4 flex flex-col gap-4">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <div className="text-4xl">🧺</div>
            <h3 className="text-base font-bold text-[var(--color-text)]">No products yet</h3>
            <p className="text-sm text-[var(--color-subtle)] max-w-xs">
              Add products in the product manager to start marking what you have at home.
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wide mb-2 px-1">
                {CATEGORY_LABELS[category] ?? category}
              </h2>
              <Card padding="none">
                {items.map((p, i) => (
                  <div
                    key={p.id}
                    className={`flex items-center gap-3 px-4 py-3 ${i < items.length - 1 ? 'border-b border-[var(--color-border)]' : ''}`}
                  >
                    <button
                      onClick={() => toggle(p.id)}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        available.has(p.id)
                          ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white'
                          : 'border-[var(--color-border)]'
                      }`}
                    >
                      {available.has(p.id) && <span className="text-xs font-bold">✓</span>}
                    </button>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-[var(--color-text)]">{p.name}</span>
                      {p.brand && <span className="text-xs text-[var(--color-subtle)] ml-1.5">· {p.brand}</span>}
                    </div>
                    <StoreBadge store={p.store} />
                  </div>
                ))}
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
