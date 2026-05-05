import { z } from "zod"

export const userSchema = z.object({
  name: z.string().min(1, "El nom es obligatori"),

  username: z
    .string()
    .min(5, "El nom d’usuari ha de tenir almenys 5 caracters")
    .max(20, "Maxim 20 caracters"),

  email: z
    .string()
    .email("Email no es valid"),


  completed_tasks: z
    .number()
    .int("Ha de ser un numero enter")
    .min(0, "No pot ser negatiu"),

  score: z
    .number()
    .int("Ha de ser un numero enter")
    .min(0, "No pot ser negatiu"),
})