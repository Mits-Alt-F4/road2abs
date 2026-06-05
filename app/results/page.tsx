import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ResultsClient } from './ResultsClient'
import { scoreRecipe, calorieBand, recipeMatchesBand } from '@/lib/utils/macros'
import type { MacroInput, NutritionTargets, Store } from '@/types'

const DEFAULT_TARGETS: NutritionTargets = {
  calories: 2070,
  protein_min: 130,
  protein_target: 160,
  protein_max: 180,
}

export default async function ResultsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const params = await searchParams
  const remaining: MacroInput = {
    calories: parseFloat(params.calories) || 0,
    protein: parseFloat(params.protein) || 0,
    carbs: params.carbs ? parseFloat(params.carbs) : null,
    fat: params.fat ? parseFloat(params.fat) : null,
  }

  const situation = params.situation ?? 'meal'
  const storeParam = params.store ?? 'any_nearby'
  const nearbyOnly = params.nearby_only !== 'false'
  const budget = parseFloat(params.budget) || 10
  const timeFilter = params.time_filter ?? 'any'
  const maxProtein = params.max_protein === 'true'

  const { data: targets } = await supabase
    .from('nutrition_targets')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const nutritionTargets = targets ?? DEFAULT_TARGETS

  // Calorie band — drives what recipe sizes are shown
  const band = calorieBand(remaining.calories ?? 0)

  // Build recipe query — DO NOT filter by suitable_contexts in DB (it breaks for 'meal')
  // Instead filter in JS for flexibility
  let query = supabase
    .from('recipes')
    .select('*, recipe_ingredients(*, products(*))')
    .eq('active', true)

  // Time filter in DB (these are hard constraints)
  if (timeFilter === 'none') {
    query = query.eq('total_time_min', 0)
  } else if (timeFilter === 'under_10') {
    query = query.lte('total_time_min', 10)
  } else if (timeFilter === 'under_20') {
    query = query.lte('total_time_min', 20)
  }

  const { data: allRecipes } = await query.limit(80)

  const { data: favourites } = await supabase
    .from('favourites')
    .select('recipe_id')
    .eq('user_id', user.id)

  const favSet = new Set((favourites ?? []).map((f) => f.recipe_id))

  // JS filtering — more flexible than DB contains()
  const filtered = (allRecipes ?? []).filter((r) => {
    const contexts: string[] = r.suitable_contexts ?? []

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
    // 'meal' — show all meal and snack results (no filter here)

    // Store filter
    const recipeStores: string[] = r.stores_required ?? []
    if (storeParam !== 'any_nearby' && storeParam !== 'any') {
      if (!recipeStores.includes(storeParam)) return false
    } else if (nearbyOnly) {
      if (!recipeStores.some((s: string) => ['coop', 'migros'].includes(s))) return false
    }

    // Calorie band filter — ensures 300 kcal input gives different results than 2000 kcal
    if (!recipeMatchesBand(r, band)) return false

    return true
  })

  // Score all filtered recipes
  const scored = filtered
    .map((r) => scoreRecipe(r, remaining, budget, nutritionTargets, favSet.has(r.id), maxProtein))
    .sort((a, b) => b.score - a.score)

  // Split into fits vs slightly over (for UI)
  const fits = scored.filter((r) => r.fits_calories).slice(0, 12)
  const slightlyOver = scored.filter((r) => !r.fits_calories).slice(0, 4)

  return (
    <ResultsClient
      results={fits}
      overBudgetResults={slightlyOver}
      remaining={remaining}
      targets={nutritionTargets}
      budget={budget}
      favouriteIds={[...favSet]}
      userId={user.id}
      calorieBand={band}
    />
  )
}
