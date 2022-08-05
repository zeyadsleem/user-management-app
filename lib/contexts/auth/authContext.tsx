//#region imports
import { ApiError, Provider, Session, User } from "@supabase/supabase-js";
import { supabase } from '@/lib/supabase'
import { createContext, FunctionComponent, useState } from "react";
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
