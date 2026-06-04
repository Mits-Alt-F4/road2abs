import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TodayClient } from './TodayClient'

const DEFAULT_TARGETS = {
  calories: 2070,
  protein_min: 130,
  protein_target: 160,
  protein_max: 180,
  carbs: null,
  fat: null,
}

export default async function TodayPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: targets } = await supabase
    .from('nutrition_targets')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: favourites } = await supabase
    .from('favourites')
    .select('recipe_id')
    .eq('user_id', user.id)

  const { data: recentRecipes } = await supabase
    .from('recently_selected_meals')
    .select('recipe_id, recipes(*)')
    .eq('user_id', user.id)
    .order('selected_at', { ascending: false })
    .limit(5)

  return (
    <TodayClient
      targets={targets ?? DEFAULT_TARGETS}
      profile={profile}
      favouriteIds={(favourites ?? []).map((f) => f.recipe_id)}
      recentRecipes={(recentRecipes ?? []).map((r) => r.recipes).filter(Boolean)}
    />
  )
}
