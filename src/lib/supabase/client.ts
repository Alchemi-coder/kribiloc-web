import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Le client 'browser' utilise exclusivement la clé publique (ANON_KEY).
  // Ne JAMAIS utiliser la SERVICE_ROLE_KEY ici.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
