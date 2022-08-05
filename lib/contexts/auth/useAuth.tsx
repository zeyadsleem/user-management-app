//#region imports
import { useContext } from "react"
import { AuthContext } from "./authContext"
//#endregion

//#region useAuth Function
export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context == null) {
    throw new Error("useAuth must be used within a AuthContext.Provider");
  }

  return context;
}
//#endregion