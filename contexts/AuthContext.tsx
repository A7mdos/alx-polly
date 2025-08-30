"use client"

import { getSupabase } from "@/lib/supabase/client"
import { Session, SupabaseClient } from "@supabase/supabase-js"
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

export type SupabaseContextType = {
  supabase: SupabaseClient<any, "public", any>
  session: Session | null
}

export const SupabaseContext = createContext<SupabaseContextType | null>(null)

export const SupabaseProvider = ({ children }: PropsWithChildren) => {
  const [supabase] = useState(() => getSupabase())
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <SupabaseContext.Provider value={{ supabase, session }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider")
  }
  return context
}
