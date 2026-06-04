import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SavedClient } from './SavedClient'

export default async function SavedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: favourites } = await supabase
    .from('favourites')
    .select('recipe_id, recipes(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: shoppingLists } = await supabase
    .from('shopping_lists')
    .select('id, name, created_at, shopping_list_items(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recipes = (favourites ?? []).flatMap((f: any) => f.recipes ? [f.recipes] : [])

  return <SavedClient recipes={recipes} shoppingLists={shoppingLists ?? []} userId={user.id} />
}
