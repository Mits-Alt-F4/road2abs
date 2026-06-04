import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ResultsClient } from './ResultsClient'
import { scoreRecipe } from '@/lib/utils/macros'
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

  // Build store filter
  const allowedStores: Store[] = nearbyOnly
    ? ['coop', 'migros']
    : ['coop', 'migros', 'lidl', 'denner']

  if (storeParam !== 'any_nearby' && storeParam !== 'any') {
    const specific = storeParam as Store
    if (allowedStores.includes(specific)) {
      // Will filter in scoring
    }
  }

  // Fetch recipes matching situation
  let query = supabase
    .from('recipes')
    .select('*, recipe_ingredients(*, products(*))')
    .eq('active', true)
    .contains('suitable_contexts', situation !== 'meal' ? [situation] : [])

  if (timeFilter === 'none') {
    query = query.eq('total_time_min', 0)
  } else if (timeFilter === 'under_10') {
    query = query.lte('total_time_min', 10)
  } else if (timeFilter === 'under_20') {
    query = query.lte('total_time_min', 20)
  }

  const { data: allRecipes } = await query.limit(50)

  const { data: favourites } = await supabase
    .from('favourites')
    .select('recipe_id')
    .eq('user_id', user.id)

  const favSet = new Set((favourites ?? []).map((f) => f.recipe_id))

  const recipes = (allRecipes ?? []).filter((r) => {
    if (storeParam !== 'any_nearby' && storeParam !== 'any') {
      return r.stores_required?.includes(storeParam)
    }
    if (nearbyOnly) {
      return r.stores_required?.some((s: string) => ['coop', 'migros'].includes(s))
    }
    return true
  })

  const scored = recipes
    .map((r) => scoreRecipe(r, remaining, budget, nutritionTargets, favSet.has(r.id), maxProtein))
    .sort((a, b) => b.score - a.score)
    .slice(0, 15)

  return (
    <ResultsClient
      results={scored}
      remaining={remaining}
      targets={nutritionTargets}
      budget={budget}
      favouriteIds={[...favSet]}
      userId={user.id}
    />
  )
}
