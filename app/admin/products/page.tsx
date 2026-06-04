import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminProductsClient } from './AdminProductsClient'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('store')
    .order('name')

  return <AdminProductsClient products={products ?? []} userId={user.id} />
}
