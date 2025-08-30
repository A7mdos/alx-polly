import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { Session, SupabaseClient } from '@supabase/supabase-js'

let supabase: SupabaseClient<any, "public", any> | undefined = undefined

export const getSupabase = (session: Session | null = null) => {
  if (!supabase) {
    supabase = createPagesBrowserClient({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    })
  }
  if (session) {
    supabase.auth.setSession(session as any)
  }
  return supabase
}
