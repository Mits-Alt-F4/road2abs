export type Store = 'coop' | 'migros' | 'lidl' | 'denner'
export type MealContext = 'meal' | 'snack' | 'sweet' | 'no_cooking' | 'emergency_protein' | 'meal_prep'
export type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'late_night' | 'post_gym'
export type TimeFilter = 'none' | 'under_10' | 'under_20' | 'any'
export type CookingEquipment = 'pan' | 'oven' | 'air_fryer' | 'microwave' | 'blender' | 'sandwich_press' | 'grill' | 'shaker'

export interface MacroInput {
  calories: number | null
  protein: number | null
  carbs?: number | null
  fat?: number | null
}

export interface NutritionTargets {
  calories: number
  protein_min: number
  protein_target: number
  protein_max: number
  carbs?: number | null
  fat?: number | null
}

export interface UserProfile {
  id: string
  user_id: string
  display_name: string | null
  nutrition_targets: NutritionTargets
  default_budget: number
  nearby_only: boolean
  equipment: CookingEquipment[]
  show_carbs: boolean
  show_fat: boolean
  default_store: Store | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  brand: string | null
  store: Store
  category: string
  image_url: string | null
  official_image_url: string | null
  uploaded_image_url: string | null
  product_page_url: string | null
  price_chf: number
  price_unit: string
  calories_per_100g: number
  protein_per_100g: number
  carbs_per_100g: number
  fat_per_100g: number
  package_size_g: number
  calories_per_package: number
  protein_per_package: number
  carbs_per_package: number
  fat_per_package: number
  availability_notes: string | null
  last_checked: string | null
  verified: boolean
  source_notes: string | null
  tags: string[]
  active: boolean
  created_at: string
  updated_at: string
}

export interface RecipeIngredient {
  id: string
  recipe_id: string
  product_id: string
  product?: Product
  quantity_g: number
  notes: string | null
}

export interface Recipe {
  id: string
  name: string
  category: string
  description: string | null
  image_url: string | null
  instructions: string[]
  prep_time_min: number
  cook_time_min: number
  total_time_min: number
  servings: number
  equipment_required: CookingEquipment[]
  suitable_contexts: MealContext[]
  suitable_times: MealTime[]
  stores_required: Store[]
  tags: string[]
  ingredients?: RecipeIngredient[]
  total_calories: number
  total_protein: number
  total_carbs: number
  total_fat: number
  estimated_price_chf: number
  protein_efficiency: number
  times_selected: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface Favourite {
  id: string
  user_id: string
  recipe_id: string
  recipe?: Recipe
  created_at: string
}

export interface RecentlySelected {
  id: string
  user_id: string
  recipe_id: string
  recipe?: Recipe
  selected_at: string
}

export interface PantryItem {
  id: string
  user_id: string
  product_id: string
  product?: Product
  available: boolean
  updated_at: string
}

export interface ShoppingList {
  id: string
  user_id: string
  name: string
  created_at: string
  items?: ShoppingListItem[]
}

export interface ShoppingListItem {
  id: string
  shopping_list_id: string
  product_id: string
  product?: Product
  quantity_g: number
  checked: boolean
  added_from_recipe_id: string | null
}

export interface DailyMacroInput {
  id: string
  user_id: string
  input_date: string
  mode: 'remaining' | 'consumed'
  calories: number
  protein: number
  carbs: number | null
  fat: number | null
  store_filter: Store | null
  nearby_only: boolean
  budget_chf: number
  situation: MealContext | null
  meal_time: MealTime | null
  created_at: string
}

export interface ProgressEntry {
  id: string
  user_id: string
  entry_date: string
  weight_kg: number | null
  energy_level: 'low' | 'okay' | 'good' | null
  hunger_level: 'low' | 'manageable' | 'high' | null
  gym_performance: 'improving' | 'stable' | 'worse' | null
  notes: string | null
  created_at: string
}

export interface RecommendationResult {
  recipe: Recipe
  fits_calories: boolean
  calories_remaining_after: number
  reaches_protein_min: boolean
  reaches_protein_target: boolean
  protein_remaining_after: number
  protein_efficiency: number
  price_chf: number
  over_budget: boolean
  budget_diff_chf: number
  badges: string[]
  score: number
  why: string
}

export interface HomepageFormState {
  mode: 'remaining' | 'consumed'
  calories: string
  protein: string
  carbs: string
  fat: string
  situation: MealContext | null
  meal_time: MealTime | null
  store: Store | null
  nearby_only: boolean
  budget: string
  time_filter: TimeFilter
  max_protein_efficiency: boolean
  use_pantry: boolean
}
