'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge, StoreBadge } from '@/components/ui/Badge'
import { MacroRow } from '@/components/ui/MacroTag'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { chf } from '@/lib/utils/format'
import { proteinEfficiency } from '@/lib/utils/macros'

interface Product {
  id: string
  name: string
  brand: string | null
  store: string
  price_chf: number
  price_unit: string
  product_page_url: string | null
  last_checked: string | null
  verified: boolean
}

interface Ingredient {
  id: string
  quantity_g: number
  notes: string | null
  products: Product
}

interface Recipe {
  id: string
  name: string
  category: string
  description: string | null
  instructions: string[]
  prep_time_min: number
  cook_time_min: number
  total_time_min: number
  servings: number
  equipment_required: string[]
  suitable_contexts: string[]
  stores_required: string[]
  tags: string[]
  total_calories: number
  total_protein: number
  total_carbs: number
  total_fat: number
  estimated_price_chf: number
  recipe_ingredients: Ingredient[]
}

interface Props {
  recipe: Recipe
  isFavourite: boolean
  userId: string
}

const EQUIPMENT_LABELS: Record<string, string> = {
  pan: 'Pan / stove',
  oven: 'Oven',
  air_fryer: 'Air fryer',
  microwave: 'Microwave',
  blender: 'Blender',
  sandwich_press: 'Sandwich press',
  grill: 'Grill',
  shaker: 'Protein shaker',
}

export function RecipeDetailClient({ recipe, isFavourite, userId }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [fav, setFav] = useState(isFavourite)
  const [addedToList, setAddedToList] = useState(false)
  const [logged, setLogged] = useState(false)
  const efficiency = proteinEfficiency(recipe.total_protein, recipe.total_calories)

  async function toggleFav() {
    if (fav) {
      await supabase.from('favourites').delete().eq('user_id', userId).eq('recipe_id', recipe.id)
    } else {
      await supabase.from('favourites').insert({ user_id: userId, recipe_id: recipe.id })
    }
    setFav(!fav)
  }

  async function logMeal() {
    await supabase.from('recently_selected_meals').upsert(
      { user_id: userId, recipe_id: recipe.id, selected_at: new Date().toISOString() },
      { onConflict: 'user_id,recipe_id' }
    )
    setLogged(true)
  }

  async function addToShoppingList() {
    const today = new Date().toISOString().slice(0, 10)
    const { data: list } = await supabase
      .from('shopping_lists')
      .select('id')
      .eq('user_id', userId)
      .eq('name', `Shopping ${today}`)
      .single()

    const listId = list?.id ?? (await supabase
      .from('shopping_lists')
      .insert({ user_id: userId, name: `Shopping ${today}` })
      .select('id')
      .single()
    ).data?.id

    if (!listId) return

    await supabase.from('shopping_list_items').insert(
      recipe.recipe_ingredients.map((i) => ({
        shopping_list_id: listId,
        product_id: i.products.id,
        quantity_g: i.quantity_g,
        added_from_recipe_id: recipe.id,
        checked: false,
      }))
    )
    setAddedToList(true)
  }

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)]">
      {/* Header */}
      <header className="safe-top sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-lg text-[var(--color-muted)]">
          ←
        </button>
        <h1 className="flex-1 font-black text-[var(--color-text)] text-base truncate">
          {recipe.name}
        </h1>
        <button
          onClick={toggleFav}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all ${fav ? 'text-red-500' : 'text-[var(--color-subtle)]'}`}
        >
          {fav ? '♥' : '♡'}
        </button>
      </header>

      <div className="px-4 py-4 flex flex-col gap-4 pb-8">
        {/* Description */}
        {recipe.description && (
          <p className="text-[var(--color-muted)] text-sm leading-relaxed">{recipe.description}</p>
        )}

        {/* Macro summary card */}
        <Card padding="lg">
          <MacroRow
            calories={recipe.total_calories}
            protein={recipe.total_protein}
            carbs={recipe.total_carbs}
            fat={recipe.total_fat}
            showCarbsFat
            size="lg"
          />
          <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-[var(--color-subtle)] font-medium">Protein efficiency</span>
              <span className="ml-2 font-bold text-[var(--color-accent)]">{efficiency}g / 100 kcal</span>
            </div>
            <div>
              <span className="text-[var(--color-subtle)] font-medium">Est. price</span>
              <span className="ml-2 font-bold text-[var(--color-text)]">{chf(recipe.estimated_price_chf)}</span>
            </div>
            {recipe.total_time_min > 0 && (
              <div>
                <span className="text-[var(--color-subtle)] font-medium">Total time</span>
                <span className="ml-2 font-bold text-[var(--color-text)]">{recipe.total_time_min} min</span>
              </div>
            )}
          </div>
        </Card>

        {/* Stores + badges */}
        <div className="flex flex-wrap gap-2">
          {recipe.stores_required.map((s) => <StoreBadge key={s} store={s} />)}
          {recipe.tags?.slice(0, 4).map((t) => <Badge key={t} label={t} variant="stone" />)}
        </div>

        {/* Equipment */}
        {recipe.equipment_required.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm font-semibold text-[var(--color-muted)]">Equipment:</span>
            {recipe.equipment_required.map((e) => (
              <span key={e} className="text-sm text-[var(--color-text)]">
                {EQUIPMENT_LABELS[e] ?? e}
              </span>
            ))}
          </div>
        )}

        {/* Ingredients */}
        {recipe.recipe_ingredients.length > 0 && (
          <Card padding="md">
            <h2 className="font-bold text-[var(--color-text)] mb-3">Ingredients</h2>
            <div className="flex flex-col gap-3">
              {recipe.recipe_ingredients.map((ing) => (
                <div key={ing.id} className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-sm text-[var(--color-text)]">
                        {ing.products.name}
                      </span>
                      {ing.products.brand && (
                        <span className="text-xs text-[var(--color-subtle)]">· {ing.products.brand}</span>
                      )}
                      <StoreBadge store={ing.products.store} />
                    </div>
                    <div className="flex gap-3 mt-0.5">
                      <span className="text-xs text-[var(--color-subtle)]">{ing.quantity_g}g</span>
                      <span className="text-xs font-medium text-[var(--color-accent)]">
                        ≈ {chf(ing.products.price_chf)} / {ing.products.price_unit}
                      </span>
                    </div>
                    {ing.products.product_page_url && (
                      <a
                        href={ing.products.product_page_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-[var(--color-accent)] font-medium"
                      >
                        View product page ↗
                      </a>
                    )}
                    {ing.products.last_checked && (
                      <div className="text-[10px] text-[var(--color-subtle)]">
                        Price last checked: {new Date(ing.products.last_checked).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                        {!ing.products.verified && ' · unverified'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-[var(--color-subtle)] mt-3 border-t border-[var(--color-border)] pt-2">
              Price and availability may vary by branch and date. Always verify at the store.
            </p>
          </Card>
        )}

        {/* Instructions */}
        {recipe.instructions?.length > 0 && (
          <Card padding="md">
            <h2 className="font-bold text-[var(--color-text)] mb-3">How to make it</h2>
            <ol className="flex flex-col gap-3">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent-dark)] text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-[var(--color-text)] leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-2">
          <Button
            size="lg"
            fullWidth
            onClick={logMeal}
          >
            {logged ? '✓ Logged as chosen' : 'Log as chosen today'}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={addToShoppingList}
          >
            {addedToList ? '✓ Added to shopping list' : '+ Add to shopping list'}
          </Button>
        </div>
      </div>
    </div>
  )
}
