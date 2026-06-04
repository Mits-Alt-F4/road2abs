import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ShopClient } from './ShopClient'

export default async function ShopPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: targets } = await supabase
    .from('nutrition_targets')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return <ShopClient targets={targets} />
}
