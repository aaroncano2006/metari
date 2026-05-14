import { z } from "zod"



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
}).superRefine((data, context) => {
  if (data.type === "task" && !data.user_id) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "L'usuari del grup és obligatori al assignar tasques.",
      path: ["user_id"],
    })
  }
  if (data.assigner_id && !data.group_id) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Selecciona un grup",
      path: ["group_id"],
    })
  }
})