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
  
}