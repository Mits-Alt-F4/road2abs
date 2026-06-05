'use client'
import { useState } from 'react'
import Link from 'next/link'
import { DEMO_SHOPPING_LIST, type DemoShoppingItem } from '@/lib/demo/data'
import { StoreLogoByName } from '@/components/ui/StoreLogo'

export default function DemoShoppingListPage() {
  const [items, setItems] = useState(DEMO_SHOPPING_LIST)

  function toggle(id: string) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i))
  }

  const unchecked = items.filter(i => !i.checked)
  const checked = items.filter(i => i.checked)
  const totalEst = items.reduce((sum, i) => {
    const fraction = i.quantity_g / parseInt(i.product.price_unit)
    return sum + i.product.price_chf * fraction
  }, 0)

  // Group unchecked by store
  const coopItems = unchecked.filter(i => i.product.store === 'coop')
  const migrosItems = unchecked.filter(i => i.product.store === 'migros')

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">
      {/* Demo banner */}
      <div className="bg-[#1a2200] border-b border-[var(--color-lime)]/20 px-4 py-2 text-center">
        <p className="text-xs font-bold text-[var(--color-lime)]">
          Demo · <Link href="/demo/today" className="underline opacity-70">← Today</Link>
        </p>
      </div>

      <header className="sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 py-3 flex items-center gap-3">
        <Link href="/demo/today" className="w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] font-bold text-sm">←</Link>
        <div className="flex-1">
          <h1 className="text-lg font-black text-[var(--color-text)]">Shopping list</h1>
          <p className="text-xs text-[var(--color-subtle)]">
            {items.length} items · est. CHF {totalEst.toFixed(2)}
          </p>
        </div>
        <div className="text-xs font-bold text-[var(--color-muted)] bg-[var(--color-surface)] border border-[var(--color-border)] px-2.5 py-1 rounded-full">
          {checked.length}/{items.length} done
        </div>
      </header>

      <div className="px-4 py-4 flex flex-col gap-4">

        {/* Progress bar */}
        <div>
          <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-lime)] rounded-full transition-all duration-300"
              style={{ width: `${items.length > 0 ? (checked.length / items.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Coop section */}
        {coopItems.length > 0 && (
          <StoreSection store="coop" items={coopItems} onToggle={toggle} />
        )}

        {/* Migros section */}
        {migrosItems.length > 0 && (
          <StoreSection store="migros" items={migrosItems} onToggle={toggle} />
        )}

        {/* Done items */}
        {checked.length > 0 && (
          <div>
            <p className="text-xs font-bold text-[var(--color-subtle)] uppercase tracking-widest mb-2">
              Done ({checked.length})
            </p>
            <div className="flex flex-col gap-2 opacity-50">
              {checked.map(item => <ShoppingItem key={item.id} item={item} onToggle={toggle} />)}
            </div>
          </div>
        )}

        {/* Upsell to real app */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4 mt-2">
          <p className="text-sm font-black text-[var(--color-text)] mb-1">Real app: lists auto-fill from recipes</p>
          <p className="text-xs text-[var(--color-subtle)] mb-3 leading-relaxed">
            When you pick a recipe in Road2Abs, it generates a shopping list grouped by store with quantities, prices, and links to the official product pages.
          </p>
          <a href="/auth/login"
            className="block text-center bg-[var(--color-lime)] text-[#0e0e0e] font-black text-sm py-3 rounded-[var(--radius-lg)]">
            Create free account →
          </a>
        </div>
      </div>
    </div>
  )
}

function StoreSection({ store, items, onToggle }: { store: 'coop' | 'migros'; items: DemoShoppingItem[]; onToggle: (id: string) => void }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <StoreLogoByName store={store} size={18} />
        <span className="text-xs text-[var(--color-subtle)]">{items.length} item{items.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="flex flex-col gap-2">
        {items.map(item => <ShoppingItem key={item.id} item={item} onToggle={onToggle} />)}
      </div>
    </div>
  )
}

function ShoppingItem({ item, onToggle }: { item: DemoShoppingItem; onToggle: (id: string) => void }) {
  const p = item.product
  const fraction = item.quantity_g / parseInt(p.price_unit)
  const estCost = p.price_chf * fraction
  const proteinContrib = Math.round(p.protein_per_100g * item.quantity_g / 100)

  return (
    <button
      onClick={() => onToggle(item.id)}
      className={`w-full flex items-center gap-3 p-3 rounded-[var(--radius-lg)] border text-left transition-all active:scale-[0.98] ${
        item.checked
          ? 'bg-[var(--color-surface)] border-[var(--color-border)] opacity-60'
          : 'bg-[var(--color-surface)] border-[var(--color-border)]'
      }`}
    >
      {/* Checkbox */}
      <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
        item.checked ? 'bg-[var(--color-lime)] border-[var(--color-lime)]' : 'border-[var(--color-border-strong)]'
      }`}>
        {item.checked && <span className="text-[#0e0e0e] text-xs font-black">✓</span>}
      </div>

      {/* Product image */}
      <div className="w-12 h-12 flex-shrink-0 bg-white rounded-[var(--radius-md)] flex items-center justify-center p-1">
        <img src={p.image_url} alt={p.name} className="w-full h-full object-contain"
          onError={(e) => { (e.target as HTMLImageElement).style.display='none' }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-bold leading-tight ${item.checked ? 'line-through text-[var(--color-muted)]' : 'text-[var(--color-text)]'}`}>
          {p.name}
        </div>
        <div className="text-xs text-[var(--color-subtle)] mt-0.5">
          {item.quantity_g}g · for {item.for_recipe}
        </div>
        <div className="text-xs text-[var(--color-lime)] font-semibold mt-0.5">+{proteinContrib}g protein</div>
      </div>

      {/* Cost */}
      <div className="text-right flex-shrink-0">
        <div className="text-sm font-bold text-[var(--color-text)]">~CHF {estCost.toFixed(2)}</div>
        <a
          href={p.product_page_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="text-[10px] text-[var(--color-muted)] underline block mt-0.5"
        >View ↗</a>
      </div>
    </button>
  )
}
