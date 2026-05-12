import { z } from "zod"

// export const assignationSchema = z.object({
//   meta_id: z.number().int().positive("La id de la meta es obligatoria"),
//   user_id: z.number().int().positive().optional(),
//   group_id: z.number().int().positive().optional(),
//   assigner_id: z.number().int().positive().optional(),
//   needs_proofs: z.boolean().optional(),
//   start_date: z.string(),
//   due_date: z.string().optional(),
//   priority: z.enum(["high", "low"]).optional(),
//   difficulty: z.enum(["easy", "normal", "hard", "extreme"]),
  
// })

export const assignationSchema = z.object({
  meta_id: z.number().int().positive("La id de la meta es obligatoria"),
  type: z.enum(["task", "challenge"]).optional(),
  user_id: z.number().int().positive().optional(),
  group_id: z.number().int().positive().optional(),
  assigner_id: z.number().int().positive().optional(),
  needs_proofs: z.boolean().optional(),
  start_date: z.string(),
  due_date: z.string().optional(),
  priority: z.enum(["high", "low"]).optional(),
  difficulty: z.enum(["easy", "normal", "hard", "extreme"]),
}).superRefine((data, ctx) => {
  if (data.type === "task" && !data.user_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "L'usuari del grup és obligatori per tasques assignades",
      path: ["user_id"],
    })
  }
  if (data.assigner_id && !data.group_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Selecciona un grup",
      path: ["group_id"],
    })
  }
})