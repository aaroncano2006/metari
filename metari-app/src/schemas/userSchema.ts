import { z } from "zod";
import { usernameExists, emailExists } from "../services/userService";

export const createUserSchema = (currentUserId?: number) =>
  z.object({
    name: z.string().min(1, "El nom es obligatori"),

    username: z
      .string()
      .min(5, "El nom d'usuari ha de tenir almenys 5 caracters")
      .max(20, "Maxim 20 caracters")
      .refine(
        (el) => !el || /^[a-zA-Z0-9]+$/.test(el),
        "El nom d'usuari només pot contenir lletres i números!",
      )
      .refine(async (el) => !(await usernameExists(el, currentUserId)),
        "El nom d'usuari introduït ja està registrat al sistema."),

    email: z
      .string()
      .email("Email no es valid")
      .refine(async (el) => !(await emailExists(el, currentUserId)),
        "L'email introduït ja està registrat al sistema."),

    completed_tasks: z
      .number()
      .int("Ha de ser un numero enter")
      .min(0, "No pot ser negatiu"),

    score: z
      .number()
      .int("Ha de ser un numero enter")
      .min(0, "No pot ser negatiu"),
  });