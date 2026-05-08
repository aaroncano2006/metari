import type { groupUserType } from "./groupUserType"
import type { userTypeFrontend } from "./userTypeFrontend"

export type groupType = {
  id: number
  name: string
  description: string
  owner_id: number
  is_public: boolean
  created_at: string
  updated_at: string

  
  groupUsers: groupUserType[]
  user: userTypeFrontend
  owner: userTypeFrontend
  
}