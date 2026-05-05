import { z } from "zod"

export const categorySchema = z.object({
  name: z
  .string()
  .min(1, "El nom es obligatori"),
  description: z
  .string()
  .min(5, "La descripcio ha de tenir almenys 5 caracters")
  // .max(200, "Maxim 200 caracters"),
})