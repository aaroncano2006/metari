import type { userTypeFrontend } from "./userTypeFrontend"

export type commentType = {
  id: number
  assignation_id: number
  user_id: number
  body: string
  created_at: string
  updated_at: string
  user?: userTypeFrontend | null
}