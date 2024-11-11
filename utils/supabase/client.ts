import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anon_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  return createBrowserClient(
    supabase_url,
    anon_key
  )
}