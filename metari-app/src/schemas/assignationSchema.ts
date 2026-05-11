import { z } from "zod"

export const assignationSchema = z.object({
  meta_id: z.number().int().positive("La id de la meta es obligatoria"),
  user_id: z.number().int().positive().optional(),
  group_id: z.number().int().positive().optional(),
  assigner_id: z.number().int().positive().optional(),
  needs_proofs: z.boolean().optional(),
  start_date: z.string(),
  due_date: z.string().optional(),
  priority: z.enum(["high", "low"]).optional(),
  difficulty: z.enum(["easy", "normal", "hard", "extreme"]),
})