//#region imports
import { ApiError, Provider, Session, User } from "@supabase/supabase-js";
import { supabase } from '@/lib/supabase'
import { createContext, FunctionComponent, useState } from "react";
//#endregion

//#region create needed values
type SigningOptions = Promise<{
  email?: string
  password?: string
  provider?: Provider
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
//#endregion

//#region AuthContext
export type AuthContextProps = {
  session: Session | null
  user: User | null
  signIn: (options: SigningOptions) => SignInResponse
  signOut: () => SignOutResponse
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined)
//#endregion 

//#region AuthProvider Function
export const AuthProvider: FunctionComponent = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)

  const values = {
    session,
    user,
    signIn: async (options: SigningOptions) => await supabase.auth.signIn(options),
    signOut: async () => await supabase.auth.signOut()
  }
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}
//#endregion