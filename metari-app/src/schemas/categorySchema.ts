import { z } from "zod"

export const categorySchema = z.object({
  name: z
  .string()
  .min(3, "Minim 3 caracters"),
  description: z
  .string()
  .optional()
  // .min(5, "La descripcio ha de tenir almenys 5 caracters")
  // .max(200, "Maxim 200 caracters"),
})