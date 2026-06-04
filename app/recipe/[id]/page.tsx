import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { RecipeDetailClient } from './RecipeDetailClient'

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { id } = await params

  const { data: recipe } = await supabase
    .from('recipes')
    .select('*, recipe_ingredients(*, products(*))')
    .eq('id', id)
    .single()

  if (!recipe) notFound()

  const { data: fav } = await supabase
    .from('favourites')
    .select('id')
    .eq('user_id', user.id)
    .eq('recipe_id', id)
    .single()

  return (
    <RecipeDetailClient
      recipe={recipe}
      isFavourite={!!fav}
      userId={user.id}
    />
  )
}
