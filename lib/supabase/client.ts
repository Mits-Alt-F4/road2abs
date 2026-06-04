import { createBrowserClient } from '@supabase/ssr'

const PLACEHOLDER_URL = 'https://placeholder.supabase.co'
const PLACEHOLDER_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'

function isValidUrl(v: string | undefined): boolean {
  if (!v) return false
  try { new URL(v); return true } catch { return false }
}

export function createClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const url = isValidUrl(rawUrl) ? rawUrl! : PLACEHOLDER_URL
  const key = rawKey && rawKey.length > 20 ? rawKey : PLACEHOLDER_KEY
  return createBrowserClient(url, key)
}
