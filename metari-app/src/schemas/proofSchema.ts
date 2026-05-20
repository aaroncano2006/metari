import { z } from "zod"
export const proofSchema = z.object({
  assignation_id: z.number().int().positive(),
  user_id: z.number().int().positive().nullable().optional(),
  proof: z
    .string()
    .min(5, "La prova ha de tenir almenys 5 caràcters")
    .max(2000, "La prova no pot tenir més de 2000 caràcters"),
  proof_type: z.enum(["text", "image"]),
  is_valid: z.boolean().optional(),
})