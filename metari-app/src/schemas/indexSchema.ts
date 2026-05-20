import { z } from "zod"

export const indexSchema = z.object({
  user_id: z.number().int().positive(),
  meta_id: z.number().int().positive(),
  is_approved: z.boolean().optional(),
  is_comunity_approved: z.boolean().optional(),
})