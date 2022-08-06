//#region imports
import { ApiError, Provider, Session, User, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from '@/lib/supabase'
import { createContext, FunctionComponent, useEffect, useState } from "react";
import { ReactNode } from "react";
//#endregion

//#region create needed values
type SignIngOptions = Promise<{
  email?: string | undefined
  password?: string | undefined
  provider?: Provider | undefined
}>

type SignInResponse = Promise<{
  session: Session | null
  user: User | null
  provider?: Provider | undefined
  url?: string | null | undefined
  error: ApiError | null
}>

type SignOutResponse = Promise<{
  error: ApiError | null
}>

type Props = {
  children?: ReactNode
}

type AuthContextProps = {
  session: Session | null
  user: User | null
  signIn: (options: SignIngOptions) => SignInResponse
  signOut: () => SignOutResponse
}
//#endregion

//#region export AuthContext
export const AuthContext = createContext<AuthContextProps | undefined>(undefined)
//#endregion 

//#region AuthProvider Function
export const AuthProvider: FunctionComponent = ({ children }: Props) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)

  const setServerSession = async (event: AuthChangeEvent, session: Session | null) => {
    await fetch('./api',
      {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({ event, session })
      })
  }

  useEffect(() => {
    const session = supabase.auth.session()
    setSession(session);
    setUser(session?.user ?? null)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      await setServerSession(event, session)
      setSession(session)
      setUser(session?.user ?? null)
    })
    return () => authListener?.unsubscribe
  }, [])


  const values = {
    session,
    user,
    // FIXME Fix options
    signIn: async (options: SignIngOptions) => await supabase.auth.signIn(options),
    signOut: async () => await supabase.auth.signOut()
  }
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}
//#endregion
