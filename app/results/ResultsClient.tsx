'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Badge, StoreBadge } from '@/components/ui/Badge'
import { MacroRow } from '@/components/ui/MacroTag'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { chf } from '@/lib/utils/format'
import type { MacroInput, NutritionTargets, RecommendationResult } from '@/types'

interface Props {
  results: RecommendationResult[]
  remaining: MacroInput
  targets: NutritionTargets
  budget: number
  favouriteIds: string[]
  userId: string
}

export function ResultsClient({ results, remaining, targets, budget, favouriteIds, userId }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [favs, setFavs] = useState(new Set(favouriteIds))
  const [addedToList, setAddedToList] = useState(new Set<string>())

  async function toggleFav(recipeId: string) {
    if (favs.has(recipeId)) {
      await supabase.from('favourites').delete().eq('user_id', userId).eq('recipe_id', recipeId)
      setFavs((prev) => { const n = new Set(prev); n.delete(recipeId); return n })
    } else {
      await supabase.from('favourites').insert({ user_id: userId, recipe_id: recipeId })
      setFavs((prev) => new Set([...prev, recipeId]))
    }
  }

  async function addToShoppingList(recipeId: string) {
    const today = new Date().toISOString().slice(0, 10)
    const { data: list } = await supabase
      .from('shopping_lists')
      .select('id')
      .eq('user_id', userId)
      .eq('name', `Shopping ${today}`)
      .single()

    const listId = list?.id ?? (await supabase.from('shopping_lists').insert({
      user_id: userId,
      name: `Shopping ${today}`,
    }).select('id').single()).data?.id

    if (!listId) return

    const { data: ingredients } = await supabase
      .from('recipe_ingredients')
      .select('product_id, quantity_g')
      .eq('recipe_id', recipeId)

    if (ingredients) {
      await supabase.from('shopping_list_items').insert(
        ingredients.map((i) => ({
          shopping_list_id: listId,
          product_id: i.product_id,
          quantity_g: i.quantity_g,
          added_from_recipe_id: recipeId,
          checked: false,
        }))
      )
    }

    setAddedToList((prev) => new Set([...prev, recipeId]))
  }

  async function logMeal(recipeId: string) {
    await supabase.from('recently_selected_meals').upsert({
      user_id: userId,
      recipe_id: recipeId,
      selected_at: new Date().toISOString(),
    }, { onConflict: 'user_id,recipe_id' })
    router.push(`/recipe/${recipeId}`)
  }

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">
      <header className="safe-top sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)]">
          ←
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-black text-[var(--color-text)]">
            {results.length > 0 ? `${results.length} options found` : 'No matches'}
          </h1>
          <p className="text-xs text-[var(--color-subtle)] truncate">
            {Math.round(remaining.calories ?? 0)} kcal · {Math.round(remaining.protein ?? 0)}g protein · {chf(budget)}
          </p>
        </div>
      </header>

      <div className="px-4 py-4 flex flex-col gap-3">
        {results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <h2 className="text-lg font-bold text-[var(--color-text)]">Nothing matched</h2>
            <p className="text-sm text-[var(--color-subtle)] max-w-xs">
              Try adjusting your filters, increasing your budget, or choosing a different store.
            </p>
            <Button variant="secondary" onClick={() => router.back()}>
              Go back and adjust
            </Button>
          </div>
        )}

        {results.map(({ recipe, fits_calories, calories_remaining_after, reaches_protein_min, reaches_protein_target, protein_remaining_after, protein_efficiency, price_chf, over_budget, budget_diff_chf, badges }) => (
          <div key={recipe.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden">
            {/* Protein efficiency bar at top */}
            <div
              className="h-1"
              style={{
                background: reaches_protein_target
                  ? 'var(--color-lime)'
                  : reaches_protein_min
                  ? 'var(--color-accent)'
                  : 'var(--color-border-strong)',
              }}
            />
            <div className="p-4 flex flex-col gap-3">
              {/* Title + price */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-[var(--color-text)] text-base leading-tight mb-1.5">
                    {recipe.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {recipe.stores_required?.map((s: string) => (
                      <StoreBadge key={s} store={s} />
                    ))}
                    <span className="text-[11px] text-[var(--color-subtle)] font-medium">
                      {recipe.total_time_min > 0 ? `${recipe.total_time_min} min` : 'No cooking'}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-base font-black ${over_budget ? 'text-[var(--color-warn)]' : 'text-[var(--color-text)]'}`}>
                    {chf(price_chf)}
                  </div>
                  {over_budget && (
                    <div className="text-[10px] text-[var(--color-warn)]">+{chf(budget_diff_chf)} over</div>
                  )}
                </div>
              </div>

              {/* Macros */}
              <MacroRow
                calories={recipe.total_calories}
                protein={recipe.total_protein}
                carbs={recipe.total_carbs}
                fat={recipe.total_fat}
                size="md"
              />

              {/* Fit summary */}
              <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-md)] px-3 py-2.5 flex flex-col gap-1">
                {fits_calories ? (
                  <span className="text-xs font-bold text-[var(--color-lime)]">
                    Fits your {Math.round(remaining.calories ?? 0)} kcal
                    {calories_remaining_after > 0 && ` — ${Math.round(calories_remaining_after)} kcal left over`}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-[var(--color-warn)]">
                    Slightly over your remaining calories
                  </span>
                )}
                {reaches_protein_target ? (
                  <span className="text-xs font-bold text-[var(--color-lime)]">
                    Hits your {targets.protein_target}g protein target
                  </span>
                ) : reaches_protein_min ? (
                  <span className="text-xs font-semibold text-[var(--color-accent-dark)]">
                    Passes {targets.protein_min}g minimum
                    {protein_remaining_after > 0 && ` — ${Math.round(protein_remaining_after)}g still needed`}
                  </span>
                ) : (
                  <span className="text-xs text-[var(--color-subtle)]">
                    {Math.round(protein_remaining_after)}g protein still needed after this
                  </span>
                )}
                <span className="text-[10px] text-[var(--color-subtle)] font-medium">
                  {protein_efficiency}g protein per 100 kcal
                </span>
              </div>

              {/* Badges */}
              {badges.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {badges.slice(0, 3).map((b) => (
                    <Badge key={b} label={b} variant={b.includes('protein') ? 'lime' : b.includes('CHF') ? 'green' : 'stone'} />
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => toggleFav(recipe.id)}
                  className={`w-10 h-10 rounded-[var(--radius-md)] border flex items-center justify-center transition-all ${
                    favs.has(recipe.id)
                      ? 'bg-[#2a0a0a] border-[#7f1d1d] text-red-400'
                      : 'bg-[var(--color-surface-raised)] border-[var(--color-border)] text-[var(--color-subtle)]'
                  }`}
                >
                  {favs.has(recipe.id) ? '♥' : '♡'}
                </button>
                <button
                  onClick={() => addToShoppingList(recipe.id)}
                  className={`w-10 h-10 rounded-[var(--radius-md)] border flex items-center justify-center transition-all ${
                    addedToList.has(recipe.id)
                      ? 'bg-[var(--color-accent-light)] border-[var(--color-accent)] text-[var(--color-accent-dark)]'
                      : 'bg-[var(--color-surface-raised)] border-[var(--color-border)] text-[var(--color-subtle)]'
                  }`}
                >
                  {addedToList.has(recipe.id) ? '✓' : '+'}
                </button>
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => logMeal(recipe.id)}>
                  View recipe
                </Button>
                <Button variant="lime" size="sm" className="flex-1" onClick={() => logMeal(recipe.id)}>
                  Choose →
                </Button>
              </div>
            </div>
          </div>
        ))}

        {results.length > 0 && (
          <p className="text-xs text-center text-[var(--color-subtle)] py-2">
            Prices are approximate. Verify at the store.
          </p>
        )}
      </div>
    </div>
  )
}
