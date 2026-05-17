import { z } from "zod"

export const searchSchema = z.object({
  word: z
  .string()
  .min(1, "El criteri de cerca no pot quedar buit!"),
})