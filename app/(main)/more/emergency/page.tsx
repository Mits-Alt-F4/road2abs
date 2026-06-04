import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EmergencyClient } from './EmergencyClient'

export default async function EmergencyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: recipes } = await supabase
    .from('recipes')
    .select('*')
    .contains('suitable_contexts', ['emergency_protein'])
    .eq('active', true)
    .order('total_protein', { ascending: false })

  return <EmergencyClient recipes={recipes ?? []} />
}
