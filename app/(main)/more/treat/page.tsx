import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TreatClient } from './TreatClient'

export default async function TreatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: targets } = await supabase
    .from('nutrition_targets')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: treats } = await supabase
    .from('products')
    .select('*')
    .contains('tags', ['sweet'])
    .eq('active', true)
    .order('name')

  return <TreatClient targets={targets} treats={treats ?? []} userId={user.id} />
}
