'use client'
import Link from 'next/link'
import { useState } from 'react'
import { DEMO_PRODUCTS } from '@/lib/demo/data'
import { StoreLogoByName } from '@/components/ui/StoreLogo'

const CATEGORIES = ['All', 'Chicken', 'Fish', 'Dairy', 'Eggs', 'Carbs', 'Bread']

export default function DemoProductsPage() {
  const [cat, setCat] = useState('All')
  const [storeFilter, setStoreFilter] = useState<'all' | 'coop' | 'migros'>('all')

  const visible = DEMO_PRODUCTS.filter(p => {
    if (cat !== 'All' && p.category !== cat) return false
    if (storeFilter !== 'all' && p.store !== storeFilter) return false
    return true
  })

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">

      {/* Demo banner */}
      <div className="bg-[#141a0f] border-b border-[var(--color-lime)]/15 px-4 py-2 text-center">
        <p className="text-[11px] font-semibold text-[var(--color-lime)]/70">
          Demo ·{' '}
          <Link href="/demo/today" className="underline">← Today</Link>
          {' · '}
          <Link href="/demo/recipe" className="underline">Recipe</Link>
          {' · '}
          <Link href="/demo/shopping-list" className="underline">Shopping list</Link>
        </p>
      </div>

      <header className="sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center justify-between mb-0.5">
          <h1 className="text-lg font-black text-[var(--color-text)]">Verified products</h1>
          <span className="text-xs font-semibold text-[var(--color-muted)] bg-[var(--color-surface)] border border-[var(--color-border)] px-2.5 py-1 rounded-full">
            {visible.length} of {DEMO_PRODUCTS.length}
          </span>
        </div>
        <p className="text-[11px] text-[var(--color-subtle)]">Scraped from coop.ch & migros.ch · prices last checked Jun 2025</p>
      </header>

      {/* Store filter */}
      <div className="px-4 pt-3 flex gap-2">
        {(['all', 'coop', 'migros'] as const).map(s => (
          <button key={s} onClick={() => setStoreFilter(s)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
              storeFilter === s
                ? 'border-[var(--color-lime)] bg-[var(--color-lime-dim)] text-[var(--color-lime)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]'
            }`}>
            {s === 'all'
              ? 'All stores'
              : <><StoreLogoByName store={s} size={13} /> {s.charAt(0).toUpperCase() + s.slice(1)}</>
            }
          </button>
        ))}
      </div>

      {/* Category chips */}
      <div className="px-4 pt-2 flex gap-1.5 overflow-x-auto pb-0.5">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
              cat === c
                ? 'bg-[var(--color-lime)] text-[#0D0F0E] border-[var(--color-lime)]'
                : 'bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)]'
            }`}>{c}</button>
        ))}
      </div>

      {/* Product list */}
      <div className="px-4 py-3 flex flex-col gap-2.5 pb-8">
        {visible.map(p => {
          const eff = (p.protein_per_100g / (p.calories_per_100g || 1) * 100).toFixed(1)
          return (
            <div key={p.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden flex">

              {/* Product photo */}
              <div className="w-[88px] bg-white flex items-center justify-center p-2 flex-shrink-0">
                <img src={p.image_url} alt={p.name}
                  className="w-full h-full object-contain"
                  style={{ aspectRatio: '1' }}
                  onError={e => { (e.target as HTMLImageElement).style.opacity = '0' }} />
              </div>

              {/* Info */}
              <div className="flex-1 p-3 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-1 mb-0.5">
                    <div className="min-w-0">
                      <p className="text-[10px] text-[var(--color-subtle)] font-medium truncate">{p.brand}</p>
                      <p className="text-sm font-black text-[var(--color-text)] leading-tight">{p.name}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-base font-black text-[var(--color-text)]">CHF {p.price_chf.toFixed(2)}</p>
                      <p className="text-[9px] text-[var(--color-subtle)]">{p.price_unit}</p>
                    </div>
                  </div>
                </div>

                {/* Macros row */}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <StoreLogoByName store={p.store} size={14} />
                  <span className="macro-pill macro-pill-protein">{p.protein_per_100g}g P</span>
                  <span className="macro-pill macro-pill-cal">{p.calories_per_100g} kcal</span>
                  <span className="text-[9px] text-[var(--color-subtle)]">{eff}g/100kcal</span>
                </div>

                {/* Macro bar */}
                <div className="flex gap-1 mt-1.5">
                  {[
                    { val: p.protein_per_100g,  max: 30,  color: 'var(--color-lime)' },
                    { val: p.carbs_per_100g,    max: 80,  color: 'var(--color-border-strong)' },
                    { val: p.fat_per_100g,      max: 30,  color: '#404840' },
                  ].map((m, i) => (
                    <div key={i} className="flex-1 h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.min(100, (m.val / m.max) * 100)}%`, background: m.color }} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-1 mt-0.5">
                  {[['P', p.protein_per_100g], ['C', p.carbs_per_100g], ['F', p.fat_per_100g]].map(([l, v]) => (
                    <div key={l} className="flex-1 text-[8px] text-[var(--color-subtle)]">{l} {v}g</div>
                  ))}
                </div>

                <a href={p.product_page_url} target="_blank" rel="noopener noreferrer"
                  className="text-[9px] text-[var(--color-muted)] underline mt-1 inline-block">
                  Official page ↗
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
