import { z } from "zod"

export const commentSchema = z.object({
  assignation_id: z.number().int().positive(),
  user_id: z.number().int().positive(),
  body: z
    .string()
    .min(5, "El commentari ha de tenir almenys 5 caracters")
    .max(500, "El commentari no pot tenir mes de 500 caracters")
})