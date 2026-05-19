import { z } from "zod"

export const metaSchema = z.object({
  title: z.string().min(5, "El titol ha de tenir almenys 5 caràcters"),
  description: z.string().optional(),
  author_id: z.number().int().positive().optional(),
  group_id: z.number().int().positive().optional(),
  category_id: z.number().int().positive().optional(),
  is_public: z.boolean().optional(),
  type: z.enum(["task", "challenge"]),
})
