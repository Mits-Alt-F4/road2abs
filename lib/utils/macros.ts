import type { NutritionTargets, MacroInput, RecommendationResult, Recipe } from '@/types'

export function calorieBand(calLeft: number): 'emergency' | 'light' | 'medium' | 'large' {
  if (calLeft < 300) return 'emergency'
  if (calLeft < 600) return 'light'
  if (calLeft < 900) return 'medium'
  return 'large'
}

export function recipeMatchesBand(recipe: Recipe, band: ReturnType<typeof calorieBand>): boolean {
  const cal = recipe.total_calories
  const contexts: string[] = recipe.suitable_contexts ?? []
  const isSnack = contexts.some((c: string) => ['snack', 'emergency_protein', 'no_cooking', 'sweet'].includes(c))
  if (band === 'emergency') return cal <= 350 || isSnack
  if (band === 'light') return cal <= 680
  if (band === 'medium') return cal <= 980
  return true
}

export function whyItFits(recipe: Recipe, remaining: MacroInput, budget: number, reaches_protein_target: boolean, fits_calories: boolean): string {
  const cal = remaining.calories ?? 0
  const pro = remaining.protein ?? 0
  const parts: string[] = []
  if (reaches_protein_target) parts.push(`Hits your ${Math.round(pro)}g protein target`)
  else parts.push(`Gives ${recipe.total_protein}g of ${Math.round(pro)}g protein needed`)
  if (fits_calories) {
    const leftover = cal - recipe.total_calories
    parts.push(leftover < 80 ? `uses almost all your ${Math.round(cal)} kcal` : `fits in ${Math.round(cal)} kcal (${Math.round(leftover)} spare)`)
  } else {
    parts.push(`${Math.round(recipe.total_calories - cal)} kcal over — shown anyway`)
  }
  if (recipe.estimated_price_chf <= budget) parts.push(`within CHF ${budget.toFixed(0)} budget`)
  return parts.join(' · ')
}

export function calcRemaining(targets: NutritionTargets, consumed: MacroInput): MacroInput {
  return {
    calories: targets.calories - (consumed.calories ?? 0),
    protein: targets.protein_target - (consumed.protein ?? 0),
    carbs: targets.carbs != null && consumed.carbs != null
      ? targets.carbs - consumed.carbs
      : null,
    fat: targets.fat != null && consumed.fat != null
      ? targets.fat - consumed.fat
      : null,
  }
}

export function proteinEfficiency(protein_g: number, calories: number): number {
  if (calories === 0) return 0
  return Math.round((protein_g / calories) * 100 * 10) / 10
}

export function calcRecipeMacros(recipe: Recipe) {
  return {
    calories: recipe.total_calories,
    protein: recipe.total_protein,
    carbs: recipe.total_carbs,
    fat: recipe.total_fat,
    price: recipe.estimated_price_chf,
    efficiency: proteinEfficiency(recipe.total_protein, recipe.total_calories),
  }
}

export function scoreRecipe(
  recipe: Recipe,
  remaining: MacroInput,
  budget: number,
  targets: NutritionTargets,
  isFavourite: boolean,
  maxProteinEfficiency: boolean
): RecommendationResult {
  const cal = remaining.calories ?? 9999
  const pro = remaining.protein ?? 0

  const fits_calories = recipe.total_calories <= cal
  const calories_remaining_after = cal - recipe.total_calories
  const reaches_protein_min =
    (pro - recipe.total_protein) <= (targets.protein_target - targets.protein_min)
  const reaches_protein_target = recipe.total_protein >= pro
  const protein_remaining_after = Math.max(0, pro - recipe.total_protein)
  const efficiency = proteinEfficiency(recipe.total_protein, recipe.total_calories)
  const over_budget = recipe.estimated_price_chf > budget
  const budget_diff_chf = recipe.estimated_price_chf - budget

  const badges: string[] = []
  if (efficiency >= 8) badges.push('Best protein for calories')
  if (recipe.estimated_price_chf < 8) badges.push('Under CHF 8')
  if (recipe.estimated_price_chf <= budget) badges.push('Under CHF ' + budget.toFixed(0))
  if (recipe.total_time_min === 0 || recipe.suitable_contexts.includes('no_cooking'))
    badges.push('No cooking')
  if (recipe.suitable_contexts.includes('emergency_protein'))
    badges.push('Emergency protein')
  if (reaches_protein_target) badges.push('Hits protein target')
  if (reaches_protein_min) badges.push('Reaches protein minimum')

  let score = 0
  if (fits_calories) {
    score += 50
    const utilisation = recipe.total_calories / Math.max(cal, 1)
    if (utilisation >= 0.6 && utilisation <= 1.0) score += 20 * utilisation
  } else {
    const overflowRatio = (recipe.total_calories - cal) / Math.max(cal, 1)
    score -= overflowRatio * 60
  }
  score += Math.min(35, (recipe.total_protein / Math.max(pro, 1)) * 35)
  if (!over_budget) score += 10
  if (isFavourite) score += 8
  if (maxProteinEfficiency) score += efficiency * 2

  const why = whyItFits(recipe, remaining, budget, reaches_protein_target, fits_calories)

  return {
    recipe,
    fits_calories,
    calories_remaining_after,
    reaches_protein_min,
    reaches_protein_target,
    protein_remaining_after,
    protein_efficiency: efficiency,
    price_chf: recipe.estimated_price_chf,
    over_budget,
    budget_diff_chf,
    badges,
    score,
    why,
  }
}

export function formatMacro(value: number, unit: string): string {
  if (unit === 'g') return `${Math.round(value)}g`
  if (unit === 'kcal') return `${Math.round(value)} kcal`
  if (unit === 'chf') return `CHF ${value.toFixed(2)}`
  return `${value}`
}

export function proteinRangeLabel(
  current: number,
  targets: NutritionTargets
): { label: string; color: string } {
  if (current < targets.protein_min)
    return { label: 'Below minimum', color: 'text-orange-500' }
  if (current <= targets.protein_target)
    return { label: 'On track', color: 'text-green-600' }
  if (current <= targets.protein_max)
    return { label: 'Great', color: 'text-green-700' }
  return { label: 'Above range', color: 'text-stone-400' }
}
