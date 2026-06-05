'use client'
import Link from 'next/link'
import { useState } from 'react'
import { DEMO_RECIPES, DEMO_PRODUCTS } from '@/lib/demo/data'
import { StoreLogoByName } from '@/components/ui/StoreLogo'

// Use the Chicken Teriyaki Rice Bowl as the showcase recipe
const RECIPE = DEMO_RECIPES.find(r => r.id === 'demo-8')!

// Ingredients for this recipe
const INGREDIENTS = [
  { product: DEMO_PRODUCTS.find(p => p.id === 'dp-2')!, quantity_g: 200, note: 'sliced into strips' },
  { product: DEMO_PRODUCTS.find(p => p.id === 'dp-9')!, quantity_g: 150, note: 'dry weight' },
]

export default function DemoRecipePage() {
  const [addedToList, setAddedToList] = useState(false)
  const [savedFav, setSavedFav] = useState(false)

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">
      {/* Demo banner */}
      <div className="bg-[#1a2200] border-b border-[var(--color-lime)]/20 px-4 py-2 text-center">
        <p className="text-xs font-bold text-[var(--color-lime)]">
          Demo · <Link href="/demo/today" className="underline opacity-70">← Today</Link>
        </p>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 py-3 flex items-center gap-3">
        <Link href="/demo/today" className="w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] font-bold text-sm">←</Link>
        <h1 className="text-base font-black text-[var(--color-text)] flex-1 min-w-0 truncate">{RECIPE.name}</h1>
      </header>

      <div className="px-4 py-4 flex flex-col gap-5">
        {/* Hero macros */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4">
          <div className="flex items-center gap-2 mb-3">
            {RECIPE.stores_required.map(s => <StoreLogoByName key={s} store={s} size={20} />)}
            <span className="text-xs text-[var(--color-subtle)] font-medium">{RECIPE.total_time_min} min</span>
            <span className="text-xs font-bold text-[var(--color-lime)] ml-auto">CHF {RECIPE.estimated_price_chf.toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Calories', value: RECIPE.total_calories, unit: 'kcal', highlight: false },
              { label: 'Protein', value: RECIPE.total_protein, unit: 'g', highlight: true },
              { label: 'Carbs', value: RECIPE.total_carbs, unit: 'g', highlight: false },
              { label: 'Fat', value: RECIPE.total_fat, unit: 'g', highlight: false },
            ].map(m => (
              <div key={m.label} className={`rounded-[var(--radius-lg)] p-2.5 text-center ${m.highlight ? 'bg-[#1a2200]' : 'bg-[var(--color-surface-raised)]'}`}>
                <div className={`text-xl font-black tabular-nums ${m.highlight ? 'text-[var(--color-lime)]' : 'text-[var(--color-text)]'}`}>
                  {m.value}{m.unit === 'kcal' ? '' : m.unit}
                </div>
                <div className="text-[9px] font-bold text-[var(--color-muted)] uppercase tracking-wide mt-0.5">{m.label}</div>
                {m.unit === 'kcal' && <div className="text-[9px] text-[var(--color-subtle)]">kcal</div>}
              </div>
            ))}
          </div>

          <div className="mt-3 text-xs text-[var(--color-muted)] font-medium leading-relaxed">
            {RECIPE.description}
          </div>
        </div>

        {/* Ingredients with product photos */}
        <div>
          <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest mb-3">Ingredients</p>
          <div className="flex flex-col gap-2">
            {INGREDIENTS.map(({ product, quantity_g, note }) => (
              <div key={product.id} className="flex items-center gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-3">
                <div className="w-14 h-14 flex-shrink-0 bg-white rounded-[var(--radius-md)] flex items-center justify-center p-1">
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display='none' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[var(--color-text)]">{product.name}</div>
                  <div className="text-xs text-[var(--color-subtle)]">{quantity_g}g {note && `· ${note}`}</div>
                  <div className="text-xs text-[var(--color-lime)] font-semibold mt-0.5">
                    {Math.round(product.protein_per_100g * quantity_g / 100)}g protein · {Math.round(product.calories_per_100g * quantity_g / 100)} kcal
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <StoreLogoByName store={product.store} size={16} />
                  <div className="text-xs font-bold text-[var(--color-text)] mt-1">
                    CHF {(product.price_chf * quantity_g / parseInt(product.price_unit)).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}

            {/* Other ingredients (pantry) */}
            {['Soy sauce (3 tbsp)', 'Honey (1 tbsp)', 'Sesame oil (1 tsp)', 'Garlic (1 clove)', 'Cooking oil'].map(item => (
              <div key={item} className="flex items-center gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] px-3 py-2.5">
                <div className="w-7 h-7 rounded-full bg-[var(--color-surface-raised)] flex items-center justify-center text-sm flex-shrink-0">🧂</div>
                <span className="text-sm text-[var(--color-muted)]">{item}</span>
                <span className="ml-auto text-[10px] text-[var(--color-subtle)]">pantry</span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div>
          <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest mb-3">Method</p>
          <div className="flex flex-col gap-2">
            {RECIPE.instructions.map((step, i) => (
              <div key={i} className="flex gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-3">
                <div className="w-6 h-6 rounded-full bg-[var(--color-lime)] flex items-center justify-center text-[#0e0e0e] text-xs font-black flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-[var(--color-text)] leading-relaxed flex-1">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => setSavedFav(!savedFav)}
            className={`flex-1 h-11 rounded-[var(--radius-lg)] text-sm font-bold border transition-all ${
              savedFav
                ? 'bg-[#2a0a0a] border-[#7f1d1d] text-red-400'
                : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-muted)]'
            }`}
          >
            {savedFav ? '♥ Saved' : '♡ Save'}
          </button>
          <button
            onClick={() => setAddedToList(!addedToList)}
            className={`flex-1 h-11 rounded-[var(--radius-lg)] text-sm font-bold border transition-all ${
              addedToList
                ? 'bg-[var(--color-accent-light)] border-[var(--color-accent)] text-[var(--color-accent-dark)]'
                : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-muted)]'
            }`}
          >
            {addedToList ? '✓ Added to list' : '+ Shopping list'}
          </button>
        </div>

        {addedToList && (
          <Link href="/demo/shopping-list"
            className="text-center text-sm font-bold text-[var(--color-lime)] underline">
            View shopping list →
          </Link>
        )}
      </div>
    </div>
  )
}
