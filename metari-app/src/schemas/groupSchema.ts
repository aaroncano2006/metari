import { z } from "zod"

export const groupSchema = z.object({
  name: z
    .string()
    .min(5, "El nom ha de tenir almenys 5 caràcters")
    .max(20, "Màxim 20 caràcters"),

  description: z
    .string()
    .min(5, "La descripció ha de tenir minim 5 caràcters")
    .max(200, "Màxim 200 caràcters"),


  is_public: z.boolean(),
})