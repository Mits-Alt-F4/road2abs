import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PrepClient } from './PrepClient'

export default async function PrepPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: recipes } = await supabase
    .from('recipes')
    .select('*')
    .contains('suitable_contexts', ['meal_prep'])
    .eq('active', true)

  return <PrepClient recipes={recipes ?? []} userId={user.id} />
}
