import type { userTypeFrontend } from "./userTypeFrontend"
import type { metaType } from "./metaType"


export type indexedType = {
  id: number
  user_id: number
  meta_id: number  
  is_approved: boolean
  is_comunity_approved: boolean

  user: userTypeFrontend
  meta: metaType
}