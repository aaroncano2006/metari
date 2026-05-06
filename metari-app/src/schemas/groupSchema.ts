import { z } from "zod"

export const groupSchema = z.object({
  name: z
    .string()
    .min(1, "El nom es obligatori")
    .max(20, "Maxim 20 caracters"),

  description: z
    .string()
    .min(5, "La descripcio ha de tenir minim 5 caracters")
    .max(200, "Maxim 200 caracters"),


  is_public: z.boolean(),
})