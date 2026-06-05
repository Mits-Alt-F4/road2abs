'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StoreBadge } from '@/components/ui/Badge'
import { MacroRow } from '@/components/ui/MacroTag'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { chf } from '@/lib/utils/format'
import type { MacroInput, NutritionTargets, RecommendationResult } from '@/types'

interface Props {
  results: RecommendationResult[]
  overBudgetResults?: RecommendationResult[]
  remaining: MacroInput
  targets: NutritionTargets
  budget: number
  favouriteIds: string[]
  userId: string
  calorieBand?: string
}

export function ResultsClient({ results, overBudgetResults = [], remaining, targets, budget, favouriteIds, userId, calorieBand }: Props) {
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
    const { data: list } = await supabase.from('shopping_lists').select('id').eq('user_id', userId).eq('name', `Shopping ${today}`).single()
    const listId = list?.id ?? (await supabase.from('shopping_lists').insert({ user_id: userId, name: `Shopping ${today}` }).select('id').single()).data?.id
    if (!listId) return
    const { data: ingredients } = await supabase.from('recipe_ingredients').select('product_id, quantity_g').eq('recipe_id', recipeId)
    if (ingredients) {
      await supabase.from('shopping_list_items').insert(
        ingredients.map((i) => ({ shopping_list_id: listId, product_id: i.product_id, quantity_g: i.quantity_g, added_from_recipe_id: recipeId, checked: false }))
      )
    }
    setAddedToList((prev) => new Set([...prev, recipeId]))
  }

  async function chooseRecipe(recipeId: string) {
    await supabase.from('recently_selected_meals').upsert({ user_id: userId, recipe_id: recipeId, selected_at: new Date().toISOString() }, { onConflict: 'user_id,recipe_id' })
    router.push(`/recipe/${recipeId}`)
  }

  const bandLabel: Record<string, string> = {
    emergency: 'Under 300 kcal left — snacks & emergency protein only',
    light: '300–600 kcal left — light meals & snacks',
    medium: '600–900 kcal left — normal meals',
    large: '900+ kcal left — all meals',
  }

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">
      <header className="safe-top sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] font-bold">←</button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-black text-[var(--color-text)]">
            {results.length > 0 ? `${results.length} option${results.length !== 1 ? 's' : ''} found` : 'No matches'}
          </h1>
          <p className="text-xs text-[var(--color-subtle)] truncate">
            {Math.round(remaining.calories ?? 0)} kcal · {Math.round(remaining.protein ?? 0)}g protein · {chf(budget)}
          </p>
        </div>
      </header>

      {calorieBand && (
        <div className="px-4 pt-3">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] px-3 py-2 text-xs font-semibold text-[var(--color-muted)]">
            {bandLabel[calorieBand] ?? ''}
          </div>
        </div>
      )}

      <div className="px-4 py-4 flex flex-col gap-3">
        {results.length === 0 && overBudgetResults.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <h2 className="text-xl font-black text-[var(--color-text)]">Nothing matched</h2>
            <p className="text-sm text-[var(--color-subtle)] max-w-xs">Try increasing your budget, choosing a different store, or adjusting your filters.</p>
            <Button variant="secondary" onClick={() => router.back()}>Go back</Button>
          </div>
        )}

        {results.map((r) => <RecipeCard key={r.recipe.id} r={r} favs={favs} addedToList={addedToList} onFav={toggleFav} onList={addToShoppingList} onChoose={chooseRecipe} />)}

        {overBudgetResults.length > 0 && (
          <>
            <div className="pt-2 pb-1">
              <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest">Slightly over your calories</p>
            </div>
            {overBudgetResults.map((r) => <RecipeCard key={r.recipe.id} r={r} favs={favs} addedToList={addedToList} onFav={toggleFav} onList={addToShoppingList} onChoose={chooseRecipe} dimmed />)}
          </>
        )}

        {(results.length > 0 || overBudgetResults.length > 0) && (
          <p className="text-xs text-center text-[var(--color-subtle)] py-2">Prices are approximate. Verify at the store.</p>
        )}
      </div>
    </div>
  )
}

function RecipeCard({ r, favs, addedToList, onFav, onList, onChoose, dimmed = false }: {
  r: RecommendationResult
  favs: Set<string>
  addedToList: Set<string>
  onFav: (id: string) => void
  onList: (id: string) => void
  onChoose: (id: string) => void
  dimmed?: boolean
}) {
  return (
    <div className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden ${dimmed ? 'opacity-75' : ''}`}>
      {/* Top accent bar — green if hits protein target, accent if min, grey if neither */}
      <div className="h-1" style={{ background: r.reaches_protein_target ? 'var(--color-lime)' : r.reaches_protein_min ? 'var(--color-accent)' : 'var(--color-border-strong)' }} />

      <div className="p-4 flex flex-col gap-3">
        {/* Title + price */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-[var(--color-text)] text-base leading-tight mb-1.5">{r.recipe.name}</h3>
            <div className="flex flex-wrap gap-1.5 items-center">
              {r.recipe.stores_required?.map((s: string) => <StoreBadge key={s} store={s} />)}
              <span className="text-[11px] text-[var(--color-subtle)] font-medium">
                {r.recipe.total_time_min > 0 ? `${r.recipe.total_time_min} min` : 'No cooking'}
              </span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className={`text-base font-black ${r.over_budget ? 'text-[var(--color-warn)]' : 'text-[var(--color-text)]'}`}>{chf(r.price_chf)}</div>
            {r.over_budget && <div className="text-[10px] text-[var(--color-warn)]">+{chf(r.budget_diff_chf)} over</div>}
          </div>
        </div>

        {/* Macros */}
        <MacroRow calories={r.recipe.total_calories} protein={r.recipe.total_protein} carbs={r.recipe.total_carbs} fat={r.recipe.total_fat} size="md" />

        {/* Why it fits */}
        <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-md)] px-3 py-2.5">
          <p className="text-xs font-semibold text-[var(--color-text)] leading-relaxed">{r.why}</p>
          <p className="text-[10px] text-[var(--color-subtle)] mt-1">{r.protein_efficiency}g protein per 100 kcal</p>
        </div>

        {/* Badges */}
        {r.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {r.badges.slice(0, 3).map((b) => (
              <span key={b} className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#1e2800] text-[var(--color-lime)]">{b}</span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => onFav(r.recipe.id)}
            className={`w-10 h-10 rounded-[var(--radius-md)] border flex items-center justify-center transition-all ${favs.has(r.recipe.id) ? 'bg-[#2a0a0a] border-[#7f1d1d] text-red-400' : 'bg-[var(--color-surface-raised)] border-[var(--color-border)] text-[var(--color-subtle)]'}`}
          >{favs.has(r.recipe.id) ? '♥' : '♡'}</button>
          <button
            onClick={() => onList(r.recipe.id)}
            className={`w-10 h-10 rounded-[var(--radius-md)] border flex items-center justify-center transition-all ${addedToList.has(r.recipe.id) ? 'bg-[var(--color-accent-light)] border-[var(--color-accent)] text-[var(--color-accent-dark)]' : 'bg-[var(--color-surface-raised)] border-[var(--color-border)] text-[var(--color-subtle)]'}`}
          >{addedToList.has(r.recipe.id) ? '✓' : '+'}</button>
          <Button variant="secondary" size="sm" className="flex-1" onClick={() => onChoose(r.recipe.id)}>Details</Button>
          <Button variant="lime" size="sm" className="flex-1" onClick={() => onChoose(r.recipe.id)}>Choose →</Button>
        </div>
      </div>
    </div>
  )
}
