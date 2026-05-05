import { z } from "zod"

export const metaSchema = z.object({
  title: z.string().min(1, "El titol es obligatori"),
  description: z.string().min(5, "La descripcio ha de tenir minim 5 caracters"),
  author_id: z.number().int().positive(),
  group_id: z.number().int().positive(),
  // category_id: z.number().int().positive(),
  type: z.enum(["task", "challenge"]),
})
