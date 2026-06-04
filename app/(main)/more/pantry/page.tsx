import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PantryClient } from './PantryClient'

export default async function PantryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('category')

  const { data: pantryItems } = await supabase
    .from('pantry_items')
    .select('product_id, available')
    .eq('user_id', user.id)

  const available = new Set((pantryItems ?? []).filter((p) => p.available).map((p) => p.product_id))

  return <PantryClient products={products ?? []} availableIds={[...available]} userId={user.id} />
}
