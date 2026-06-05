import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { chf } from '@/lib/utils/format'
import ShoppingListClient from './ShoppingListClient'

export default async function ShoppingListPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { id } = await params

  const { data: list } = await supabase
    .from('shopping_lists')
    .select('*, shopping_list_items(*, products(*))')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!list) redirect('/saved')

  return <ShoppingListClient list={list} userId={user.id} />
}
