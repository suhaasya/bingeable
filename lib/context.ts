import { createContext } from "react"

type UserContextType = {
  user: null | any
  username: string | null
  userId: any
}

export const UserContext = createContext<UserContextType>({
  user: null,
  username: null,
  userId: null,
})
