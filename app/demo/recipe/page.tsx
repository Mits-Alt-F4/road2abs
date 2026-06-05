'use client'
import Link from 'next/link'
import { useState } from 'react'
import { DEMO_RECIPES, DEMO_PRODUCT_MAP } from '@/lib/demo/data'
import { StoreLogoByName } from '@/components/ui/StoreLogo'
import { calcCost, calcMacros, fmtChf } from '@/lib/utils/priceCalc'

// Chicken Teriyaki Rice Bowl — showcase recipe
const RECIPE = DEMO_RECIPES.find(r => r.id === 'demo-8')!

// Correctly mapped ingredients — dp-2 = chicken, dp-13 = rice (Langkornreis)
const INGREDIENTS = [
  { product: DEMO_PRODUCT_MAP['dp-2'],  quantity_g: 200, note: 'sliced into strips' },
  { product: DEMO_PRODUCT_MAP['dp-13'], quantity_g: 150, note: 'dry weight' },
]

const PANTRY = ['Soy sauce · 3 tbsp', 'Honey · 1 tbsp', 'Sesame oil · 1 tsp', 'Garlic · 1 clove', 'Cooking oil']

export default function DemoRecipePage() {
  const [addedToList, setAddedToList] = useState(false)
  const [savedFav, setSavedFav] = useState(false)

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
          <Link href="/demo/shopping-list" className="underline">Shopping list</Link>
        </p>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 py-3 flex items-center gap-3">
        <Link href="/demo/today"
          className="w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] font-bold text-sm flex-shrink-0">
          ←
        </Link>
        <h1 className="text-base font-black text-[var(--color-text)] min-w-0 truncate">{RECIPE.name}</h1>
        <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
          {RECIPE.stores_required.map(s => <StoreLogoByName key={s} store={s} size={18} />)}
        </div>
      </header>

      <div className="px-4 py-4 flex flex-col gap-5 pb-8">

        {/* Macro summary card */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[var(--color-muted)]">{RECIPE.total_time_min} min</span>
              <span className="text-[10px] text-[var(--color-subtle)]">·</span>
              <span className="text-xs font-semibold text-[var(--color-muted)]">{RECIPE.servings} serving</span>
            </div>
            <span className="text-base font-black text-[var(--color-text)]">CHF {RECIPE.estimated_price_chf.toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-3">
            {[
              { label: 'kcal', value: RECIPE.total_calories, lime: false },
              { label: 'protein', value: `${RECIPE.total_protein}g`, lime: true },
              { label: 'carbs', value: `${RECIPE.total_carbs}g`, lime: false },
              { label: 'fat', value: `${RECIPE.total_fat}g`, lime: false },
            ].map(m => (
              <div key={m.label} className={`rounded-[var(--radius-lg)] p-2.5 text-center ${m.lime ? 'bg-[var(--color-lime)]/10' : 'bg-[var(--color-surface-raised)]'}`}>
                <div className={`text-lg font-black tabular-nums leading-none ${m.lime ? 'text-[var(--color-lime)]' : 'text-[var(--color-text)]'}`}>
                  {m.value}
                </div>
                <div className="text-[9px] font-semibold text-[var(--color-muted)] uppercase tracking-wide mt-1">{m.label}</div>
              </div>
            ))}
          </div>

          <p className="text-xs text-[var(--color-muted)] leading-relaxed">{RECIPE.description}</p>
        </div>

        {/* Ingredients */}
        <div>
          <p className="text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-widest mb-2">Ingredients to buy</p>
          <div className="flex flex-col gap-2">
            {INGREDIENTS.map(({ product, quantity_g, note }) => {
              const cost = calcCost(product.price_chf, product.price_unit, quantity_g)
              const macros = calcMacros({
                calories: product.calories_per_100g,
                protein: product.protein_per_100g,
                carbs: product.carbs_per_100g,
                fat: product.fat_per_100g,
              }, quantity_g)
              return (
                <div key={product.id} className="flex items-center gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-3">
                  <div className="w-14 h-14 flex-shrink-0 bg-white rounded-[var(--radius-md)] flex items-center justify-center p-1.5">
                    <img src={product.image_url} alt={product.name}
                      className="w-full h-full object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.opacity='0' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[var(--color-subtle)] font-medium">{product.brand}</div>
                    <div className="text-sm font-black text-[var(--color-text)] leading-tight">{product.name}</div>
                    <div className="text-xs text-[var(--color-muted)] mt-0.5">
                      {quantity_g}g {note && `· ${note}`}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-[var(--color-lime)]">{macros.protein}g protein</span>
                      <span className="text-[10px] text-[var(--color-subtle)]">{macros.calories} kcal</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <StoreLogoByName store={product.store} size={14} />
                    <div className="text-sm font-black text-[var(--color-text)] mt-1">
                      {fmtChf(cost)}
                    </div>
                    <a href={product.product_page_url} target="_blank" rel="noopener noreferrer"
                      className="text-[9px] text-[var(--color-muted)] underline block mt-0.5">site ↗</a>
                  </div>
                </div>
              )
            })}

            {/* Pantry items */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] px-3 py-2.5">
              <p className="text-[10px] font-bold text-[var(--color-subtle)] uppercase tracking-widest mb-1.5">Pantry</p>
              <div className="flex flex-wrap gap-1.5">
                {PANTRY.map(item => (
                  <span key={item} className="text-[11px] text-[var(--color-muted)] bg-[var(--color-surface-raised)] px-2 py-0.5 rounded-full">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Method */}
        <div>
          <p className="text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-widest mb-2">Method</p>
          <div className="flex flex-col gap-2">
            {RECIPE.instructions.map((step, i) => (
              <div key={i} className="flex gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-3">
                <div className="w-5 h-5 rounded-full bg-[var(--color-lime)] flex items-center justify-center text-[#0e0e0e] text-[10px] font-black flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-[var(--color-text)] leading-relaxed flex-1">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={() => setSavedFav(!savedFav)}
            className={`flex-1 h-11 rounded-[var(--radius-lg)] text-sm font-bold border transition-all ${
              savedFav
                ? 'bg-[#2a0a0a] border-[#7f1d1d] text-red-400'
                : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-muted)]'
            }`}>
            {savedFav ? '♥ Saved' : '♡ Save'}
          </button>
          <button onClick={() => setAddedToList(true)}
            className={`flex-1 h-11 rounded-[var(--radius-lg)] text-sm font-bold border transition-all ${
              addedToList
                ? 'bg-[var(--color-accent-light)] border-[var(--color-accent)] text-[var(--color-accent-dark)]'
                : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-muted)]'
            }`}>
            {addedToList ? '✓ In list' : '+ Shopping list'}
          </button>
        </div>

        {addedToList && (
          <Link href="/demo/shopping-list" className="text-center text-sm font-bold text-[var(--color-lime)] underline -mt-2">
            View shopping list →
          </Link>
        )}
      </div>
    </div>
  )
}
