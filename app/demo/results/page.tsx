import { DEMO_RECIPES, DEMO_TARGETS } from '@/lib/demo/data'
import { scoreRecipe, calorieBand, recipeMatchesBand } from '@/lib/utils/macros'
import DemoResultsClient from './DemoResultsClient'
import type { MacroInput, MealContext } from '@/types'

export default async function DemoResultsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams

  const remaining: MacroInput = {
    calories: parseFloat(params.calories) || 0,
    protein: parseFloat(params.protein) || 0,
    carbs: null,
    fat: null,
  }

  const situation = (params.situation ?? 'meal') as MealContext
  const storeParam = params.store ?? 'any_nearby'
  const budget = parseFloat(params.budget) || 10

  const band = calorieBand(remaining.calories ?? 0)

  const filtered = DEMO_RECIPES.filter((r) => {
    const contexts = r.suitable_contexts ?? []

    // Situation filter
    if (situation === 'emergency_protein') {
      if (!contexts.includes('emergency_protein') && !contexts.includes('snack')) return false
    } else if (situation === 'snack') {
      if (!contexts.includes('snack') && !contexts.includes('sweet') && !contexts.includes('no_cooking')) return false
    } else if (situation === 'sweet') {
      if (!contexts.includes('sweet') && !contexts.includes('snack')) return false
    } else if (situation === 'no_cooking') {
      if (r.total_time_min > 0 && !contexts.includes('no_cooking')) return false
    } else if (situation === 'meal_prep') {
      if (!contexts.includes('meal_prep')) return false
    }

    // Store filter (demo: all stores have the same demo recipes)
    if (storeParam !== 'any_nearby' && storeParam !== 'any') {
      if (!r.stores_required.includes(storeParam as never)) return false
    }

    // Calorie band filter — this is what changes between 300 and 2000 cal input
    if (!recipeMatchesBand(r, band)) return false

    return true
  })

  const scored = filtered
    .map((r) => scoreRecipe(r, remaining, budget, DEMO_TARGETS, false, false))
    .sort((a, b) => b.score - a.score)

  const fits = scored.filter((r) => r.fits_calories).slice(0, 10)
  const slightlyOver = scored.filter((r) => !r.fits_calories).slice(0, 3)

  return (
    <DemoResultsClient
      results={fits}
      overBudgetResults={slightlyOver}
      remaining={remaining}
      budget={budget}
      calorieBand={band}
    />
  )
}
