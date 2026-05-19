import type { userTypeFrontend } from "./userTypeFrontend"

export type assignationCompletionType = {
  id: number
  assignation_id: number
  user_id: number
  is_Completed: boolean
  user?: userTypeFrontend | null
}