import type { groupType } from "./groupType"
import type { metaType } from "./metaType"
import type { userTypeFrontend } from "./userTypeFrontend"

export type assignationType = {
  id: number
  group_id: number
  meta_id: number
  user_id: number
  start_date: string
  due_date: string
  priority: string
  difficulty: string
  score: number
  completed: boolean
  created_at: string
  updated_at: string


  group?: groupType
  meta: metaType
  user?: userTypeFrontend | null
}