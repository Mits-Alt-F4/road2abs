'use client'
import { useState } from 'react'
import Link from 'next/link'
import { DEMO_SHOPPING_LIST, type DemoShoppingItem } from '@/lib/demo/data'
import { StoreLogoByName } from '@/components/ui/StoreLogo'
import { calcCost, calcMacros, fmtChf } from '@/lib/utils/priceCalc'

export default function DemoShoppingListPage() {
  const [items, setItems] = useState(DEMO_SHOPPING_LIST)

  function toggle(id: string) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i))
  }

  const unchecked = items.filter(i => !i.checked)
  const checked = items.filter(i => i.checked)

  // Total: sum of all calculable costs — never NaN
  const totalEst = items.reduce((sum, i) => {
    const cost = calcCost(i.product.price_chf, i.product.price_unit, i.quantity_g)
    return sum + (cost ?? 0)
  }, 0)

  const coopItems = unchecked.filter(i => i.product.store === 'coop')
  const migrosItems = unchecked.filter(i => i.product.store === 'migros')

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">
      {/* Demo banner */}
      <div className="bg-[#141a0f] border-b border-[var(--color-lime)]/15 px-4 py-2 text-center">
        <p className="text-[11px] font-semibold text-[var(--color-lime)]/70">
          Demo ·{' '}
          <Link href="/demo/today" className="underline">← Today</Link>
          {' · '}
          <Link href="/demo/products" className="underline">Products</Link>
          {' · '}
          <Link href="/demo/recipe" className="underline">Recipe</Link>
        </p>
      </div>

      {/* Header with sticky total */}
      <header className="sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 py-3 flex items-center gap-3">
        <Link href="/demo/today"
          className="w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] font-bold text-sm flex-shrink-0">
          ←
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-black text-[var(--color-text)]">Shopping list</h1>
          <p className="text-xs text-[var(--color-subtle)]">{items.length} items · est. {fmtChf(totalEst)}</p>
        </div>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] px-2.5 py-1 rounded-full text-xs font-bold text-[var(--color-muted)] flex-shrink-0">
          {checked.length}/{items.length}
        </div>
      </header>

      <div className="px-4 py-3 flex flex-col gap-5 pb-8">

        {/* Progress */}
        <div className="h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-lime)] rounded-full transition-all duration-300"
            style={{ width: items.length ? `${(checked.length / items.length) * 100}%` : '0%' }}
          />
        </div>

        {coopItems.length > 0 && (
          <StoreSection store="coop" items={coopItems} onToggle={toggle} />
        )}
        {migrosItems.length > 0 && (
          <StoreSection store="migros" items={migrosItems} onToggle={toggle} />
        )}

        {checked.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-[var(--color-subtle)] uppercase tracking-widest mb-2">Done</p>
            <div className="flex flex-col gap-2 opacity-40">
              {checked.map(item => <ShoppingItem key={item.id} item={item} onToggle={toggle} />)}
            </div>
          </div>
        )}

        {/* Basket total */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[var(--color-text)]">Estimated basket</p>
            <p className="text-xs text-[var(--color-subtle)]">Prices approximate · verify in store</p>
          </div>
          <p className="text-xl font-black text-[var(--color-lime)]">{fmtChf(totalEst)}</p>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4">
          <p className="text-sm font-black text-[var(--color-text)] mb-1">Real app: lists auto-build from recipes</p>
          <p className="text-xs text-[var(--color-subtle)] mb-3 leading-relaxed">
            Pick a recipe → Road2Abs generates the shopping list, grouped by store, with quantities and prices.
          </p>
          <a href="/auth/login"
            className="block text-center bg-[var(--color-lime)] text-[#0e0e0e] font-black text-sm py-2.5 rounded-[var(--radius-lg)]">
            Create free account →
          </a>
        </div>
      </div>
    </div>
  )
}

function StoreSection({ store, items, onToggle }: {
  store: 'coop' | 'migros'
  items: DemoShoppingItem[]
  onToggle: (id: string) => void
}) {
  const storeTotal = items.reduce((sum, i) => {
    return sum + (calcCost(i.product.price_chf, i.product.price_unit, i.quantity_g) ?? 0)
  }, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <StoreLogoByName store={store} size={18} />
          <span className="text-xs text-[var(--color-subtle)]">{items.length} item{items.length !== 1 ? 's' : ''}</span>
        </div>
        <span className="text-xs font-bold text-[var(--color-muted)]">{fmtChf(storeTotal)}</span>
      </div>
      <div className="flex flex-col gap-2">
        {items.map(item => <ShoppingItem key={item.id} item={item} onToggle={onToggle} />)}
      </div>
    </div>
  )
}

function ShoppingItem({ item, onToggle }: { item: DemoShoppingItem; onToggle: (id: string) => void }) {
  const p = item.product
  const cost = calcCost(p.price_chf, p.price_unit, item.quantity_g)
  const macros = calcMacros({ calories: p.calories_per_100g, protein: p.protein_per_100g, carbs: p.carbs_per_100g, fat: p.fat_per_100g }, item.quantity_g)

  return (
    <button
      onClick={() => onToggle(item.id)}
      className="w-full flex items-center gap-3 p-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] text-left active:scale-[0.98] transition-all"
    >
      {/* Checkbox */}
      <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
        item.checked ? 'bg-[var(--color-lime)] border-[var(--color-lime)]' : 'border-[var(--color-border-strong)]'
      }`}>
        {item.checked && <span className="text-[#0e0e0e] text-[10px] font-black">✓</span>}
      </div>

      {/* Photo */}
      <div className="w-12 h-12 flex-shrink-0 bg-white rounded-[var(--radius-md)] flex items-center justify-center p-1 overflow-hidden">
        <img src={p.image_url} alt={p.name}
          className="w-full h-full object-contain"
          onError={(e) => { (e.target as HTMLImageElement).style.opacity='0' }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold leading-tight ${item.checked ? 'line-through text-[var(--color-muted)]' : 'text-[var(--color-text)]'}`}>
          {p.name}
        </p>
        <p className="text-xs text-[var(--color-subtle)] mt-0.5">{item.quantity_g}g · {item.for_recipe}</p>
        <p className="text-xs font-semibold text-[var(--color-lime)] mt-0.5">+{macros.protein}g protein</p>
      </div>

      {/* Cost */}
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-black text-[var(--color-text)]">{fmtChf(cost)}</p>
        <a href={p.product_page_url} target="_blank" rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="text-[9px] text-[var(--color-muted)] underline block mt-0.5">view ↗</a>
      </div>
    </button>
  )
}
