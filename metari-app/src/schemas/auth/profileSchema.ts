import { z } from "zod";
import { usernameExists, emailExists } from "../../services/userService";

export const createProfileSchema = (userId: number) =>
  z.object({
    name: z
      .string()
      .optional()
      .refine(
        (el) => !el || el.trim().length > 0,
        "El nom no pot estar buit!",
      ),
    username: z
      .string()
      .optional()
      .refine(
        (el) => !el || el.length >= 5,
        "El nom d'usuari ha de ser com a mínim 5 caràcters de llarg!",
      )
      .refine(
        (el) => !el || el.length <= 20,
        "El nom d'usuari ha de ser com a màxim 20 caràcters de llarg!"
      )
      .refine(
        (el) => {
          if (!el) return true;
          return /^[a-zA-Z0-9]+$/.test(el);
        },
        "El nom d'usuari només pot contenir lletres i números!",
      )
      .refine(async (el) => {
        if (!el) return true;
        return !(await usernameExists(el, userId));
      }, "El nom d'usuari introduït ja està registrat al sistema."),
    email: z
      .string()
      .optional()
      .refine(
        (el) => {
          if (!el) return true;
          return z.string().email().safeParse(el).success;
        },
        "L'email introduït no és vàlid!",
      )
      .refine(async (el) => {
        if (!el) return true;
        return !(await emailExists(el, userId));
      }, "L'email introduït ja està registrat al sistema."),
    password: z
      .string()
      .optional()
      .refine(
        (el) => !el || el.length >= 8,
        "La contrasenya ha de tenir almenys 8 caràcters!",
      ),
  });
