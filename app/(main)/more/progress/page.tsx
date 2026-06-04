import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProgressPageClient } from './ProgressPageClient'

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: entries } = await supabase
    .from('progress_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('entry_date', { ascending: false })
    .limit(12)

  return <ProgressPageClient entries={entries ?? []} userId={user.id} />
}
