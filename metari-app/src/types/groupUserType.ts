import type { groupType } from "./groupType"
import type { userTypeFrontend } from "./userTypeFrontend"

export type groupUserType = {
  group_id: number
  user_id: number
  role: "member" | "moderator"

  group: groupType
  user: userTypeFrontend
}