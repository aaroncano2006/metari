import type { categoryType } from "./categoryType"
import type { userTypeFrontend } from "./userTypeFrontend"

export type metaType = {
  id: number
  title:string 
  description?:string 
  author_id: number
  group_id?: number 
  category_id: number
  type: "task" | "challenge"
  is_public: boolean

  category: categoryType
  author: userTypeFrontend
  indexedMetas?: { is_community_approved: boolean | null; is_approved: boolean | null }[]
  
}