import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  function isValidUrl(v: string | undefined) {
    if (!v) return false
    try { new URL(v); return true } catch { return false }
  }
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const url = isValidUrl(rawUrl) ? rawUrl! : 'https://placeholder.supabase.co'
  const key = rawKey && rawKey.length > 20 ? rawKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {}
      },
    },
  })
}
