'use client'
import Link from 'next/link'
import { useState } from 'react'
import { DEMO_PRODUCTS } from '@/lib/demo/data'
import { StoreLogoByName } from '@/components/ui/StoreLogo'

const CATEGORIES = ['All', 'Chicken', 'Fish', 'Dairy', 'Eggs', 'Carbs']

export default function DemoProductsPage() {
  const [filter, setFilter] = useState('All')
  const [storeFilter, setStoreFilter] = useState<'all' | 'coop' | 'migros'>('all')

  const filtered = DEMO_PRODUCTS.filter((p) => {
    if (filter !== 'All' && p.category !== filter) return false
    if (storeFilter !== 'all' && p.store !== storeFilter) return false
    return true
  })

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">
      {/* Demo banner */}
      <div className="bg-[#1a2200] border-b border-[var(--color-lime)]/20 px-4 py-2 text-center">
        <p className="text-xs font-bold text-[var(--color-lime)]">
          Demo · <Link href="/demo/today" className="underline opacity-70">← Back to today</Link>
        </p>
      </div>

      <header className="sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 py-3">
        <h1 className="text-xl font-black text-[var(--color-text)]">Product Library</h1>
        <p className="text-xs text-[var(--color-subtle)] mt-0.5">
          {filtered.length} verified products · scraped from official Swiss supermarket sites
        </p>
      </header>

      {/* Store toggle */}
      <div className="px-4 pt-3 flex gap-2">
        {(['all', 'coop', 'migros'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStoreFilter(s)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
              storeFilter === s
                ? 'border-[var(--color-lime)] bg-[#1a2200] text-[var(--color-lime)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]'
            }`}
          >
            {s === 'all' ? '📍 All stores' : <><StoreLogoByName store={s} size={14} />{s.charAt(0).toUpperCase() + s.slice(1)}</>}
          </button>
        ))}
      </div>

      {/* Category chips */}
      <div className="px-4 pt-2 pb-1 flex gap-2 overflow-x-auto">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
              filter === c
                ? 'bg-[var(--color-lime)] text-[#0e0e0e] border-[var(--color-lime)]'
                : 'bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="px-4 py-3 flex flex-col gap-3">
        {filtered.map((p) => (
          <div key={p.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden flex">
            {/* Product image */}
            <div className="w-24 h-24 flex-shrink-0 bg-white flex items-center justify-center p-2">
              <img
                src={p.image_url}
                alt={p.name}
                className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>

            {/* Details */}
            <div className="flex-1 p-3 min-w-0">
              <div className="flex items-start justify-between gap-1 mb-1">
                <div>
                  <div className="text-xs text-[var(--color-subtle)] font-medium">{p.brand}</div>
                  <div className="text-sm font-black text-[var(--color-text)] leading-tight">{p.name}</div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-base font-black text-[var(--color-text)]">
                    CHF {p.price_chf.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-[var(--color-subtle)]">{p.price_unit}</div>
                </div>
              </div>

              {/* Store badge + macros */}
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <StoreLogoByName store={p.store} size={14} />
                <span className="text-[11px] font-bold text-[var(--color-lime)] bg-[#1a2200] px-2 py-0.5 rounded-full">
                  {p.protein_per_100g}g protein
                </span>
                <span className="text-[11px] text-[var(--color-muted)]">
                  {p.calories_per_100g} kcal
                </span>
                <span className="text-[10px] text-[var(--color-subtle)]">per 100g</span>
              </div>

              {/* Macro bar */}
              <div className="flex gap-1 mt-2">
                {[
                  { label: 'P', val: p.protein_per_100g, color: 'var(--color-lime)', max: 30 },
                  { label: 'C', val: p.carbs_per_100g, color: 'var(--color-muted)', max: 80 },
                  { label: 'F', val: p.fat_per_100g, color: '#555', max: 30 },
                ].map(({ label, val, color, max }) => (
                  <div key={label} className="flex-1">
                    <div className="h-1 rounded-full bg-[var(--color-border)] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${Math.min(100, (val / max) * 100)}%`, backgroundColor: color }}
                      />
                    </div>
                    <div className="text-[9px] text-[var(--color-subtle)] mt-0.5">{label} {val}g</div>
                  </div>
                ))}
              </div>

              <a
                href={p.product_page_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-[var(--color-muted)] underline mt-1 inline-block"
              >
                Official product page ↗
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-4 text-center">
        <p className="text-xs text-[var(--color-subtle)]">
          All prices and macros verified from official Coop & Migros product pages · last checked 2026-06-05
        </p>
      </div>
    </div>
  )
}
