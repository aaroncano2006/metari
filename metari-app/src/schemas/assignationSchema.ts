import { z } from "zod"

export const assignationSchema = z.object({
  meta_id: z.number().int().positive("La id de la meta es obligatoria"),
  user_id: z.number().int().positive().optional(),
  start_date: z.string(),
  due_date: z.string().optional(),
  priority: z.enum(["high", "low"]).optional(),
  difficulty: z.enum(["easy", "normal", "hard", "extreme"]),
})