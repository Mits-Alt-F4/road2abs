'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { chf } from '@/lib/utils/format'
import { StoreBadge } from '@/components/ui/Badge'

interface Product {
  id: string
  name: string
  brand: string | null
  store: string
  price_chf: number
  package_size_g: number
  image_url?: string | null
  product_page_url?: string | null
}

interface Item {
  id: string
  product_id: string
  quantity_g: number
  checked: boolean
  products: Product
}

interface ShoppingList {
  id: string
  name: string
  created_at: string
  shopping_list_items: Item[]
}

export default function ShoppingListClient({ list, userId }: { list: ShoppingList; userId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [items, setItems] = useState<Item[]>(list.shopping_list_items ?? [])

  async function toggleItem(itemId: string) {
    const item = items.find(i => i.id === itemId)
    if (!item) return
    const newChecked = !item.checked
    await supabase.from('shopping_list_items').update({ checked: newChecked }).eq('id', itemId)
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, checked: newChecked } : i))
  }

  const unchecked = items.filter(i => !i.checked)
  const checked = items.filter(i => i.checked)
  const totalEstimated = items.reduce((sum, i) => {
    const portionFraction = i.quantity_g / (i.products?.package_size_g || 100)
    return sum + (i.products?.price_chf ?? 0) * portionFraction
  }, 0)

  // Group by store
  const byStore: Record<string, Item[]> = {}
  unchecked.forEach(i => {
    const store = i.products?.store ?? 'other'
    if (!byStore[store]) byStore[store] = []
    byStore[store].push(i)
  })

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">
      <header className="safe-top sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] font-bold">←</button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-black text-[var(--color-text)]">{list.name}</h1>
          <p className="text-xs text-[var(--color-subtle)]">
            {items.length} items · est. {chf(totalEstimated)}
          </p>
        </div>
      </header>

      <div className="px-4 py-4 flex flex-col gap-4">
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <h2 className="text-lg font-bold text-[var(--color-text)]">List is empty</h2>
            <p className="text-sm text-[var(--color-subtle)]">Add items from a recipe to populate this list.</p>
          </div>
        )}

        {Object.entries(byStore).map(([store, storeItems]) => (
          <div key={store}>
            <div className="flex items-center gap-2 mb-2">
              <StoreBadge store={store} />
              <span className="text-xs text-[var(--color-subtle)]">{storeItems.length} item{storeItems.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex flex-col gap-2">
              {storeItems.map(item => (
                <ShoppingItem key={item.id} item={item} onToggle={toggleItem} />
              ))}
            </div>
          </div>
        ))}

        {checked.length > 0 && (
          <div>
            <p className="text-xs font-bold text-[var(--color-subtle)] uppercase tracking-widest mb-2">
              Done ({checked.length})
            </p>
            <div className="flex flex-col gap-2 opacity-50">
              {checked.map(item => (
                <ShoppingItem key={item.id} item={item} onToggle={toggleItem} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ShoppingItem({ item, onToggle }: { item: Item; onToggle: (id: string) => void }) {
  const product = item.products
  const portionG = item.quantity_g
  const estimatedCost = product ? (product.price_chf * portionG / (product.package_size_g || 100)) : 0

  return (
    <button
      onClick={() => onToggle(item.id)}
      className={`w-full flex items-center gap-3 p-3 rounded-[var(--radius-lg)] border transition-all text-left ${
        item.checked
          ? 'bg-[var(--color-surface)] border-[var(--color-border)] opacity-60'
          : 'bg-[var(--color-surface)] border-[var(--color-border)] active:scale-[0.98]'
      }`}
    >
      {/* Checkbox */}
      <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
        item.checked
          ? 'bg-[var(--color-lime)] border-[var(--color-lime)]'
          : 'border-[var(--color-border-strong)]'
      }`}>
        {item.checked && <span className="text-[#0e0e0e] text-xs font-black">✓</span>}
      </div>

      {/* Product image */}
      {product?.image_url && (
        <img src={product.image_url} alt={product.name} className="w-10 h-10 object-contain rounded-[var(--radius-sm)] flex-shrink-0 bg-white" />
      )}

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-bold ${item.checked ? 'line-through text-[var(--color-muted)]' : 'text-[var(--color-text)]'}`}>
          {product?.name ?? 'Unknown product'}
        </div>
        <div className="text-xs text-[var(--color-subtle)]">
          {portionG}g
          {product?.product_page_url && (
            <a
              href={product.product_page_url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-[var(--color-accent-dark)] underline"
              onClick={e => e.stopPropagation()}
            >
              View on site
            </a>
          )}
        </div>
      </div>

      {/* Cost estimate */}
      {estimatedCost > 0 && (
        <div className="text-xs font-semibold text-[var(--color-muted)] flex-shrink-0">
          ~{chf(estimatedCost)}
        </div>
      )}
    </button>
  )
}
