import { z } from "zod";
import { usernameExists } from "../../services/userService";
import { emailExists } from "../../services/userService";

export const profileSchema = z.object({
  name: z
    .string({ error: "El nom enviat no és vàlid! Ha de ser un text!" })
    .optional()
    .refine((el) => el?.trim() === "", "El nom no pot estar buit!"),
  username: z
    .string({ error: "El nom d'usuari enviat no és vàlid! Ha de ser un text!" })
    .min(5, {
      error: "El nom d'usuari ha de ser com a mínim 5 caràcters de llarg!",
    })
    .optional()
    .refine((el) => {
      if (el === undefined || el === null) return true;
      return /[a-zA-Z0-9]+$/.test(el);
    }, "El nom d'usuari només pot contenir lletres i números!")
    .refine(async (el) => {
      if (el === undefined || el === null) return true;
      return await usernameExists(el);
    }, "El nom d'usuari introduït ja està registrat al sistema."),
    email: z.string().optional().refine((el) => {
        if (el === undefined || el === null) return true;
        if (el.includes("@")) {
            return z.string().email().safeParse(el).success; // Utilitzem safeParse per validar sense llençar errors i reutilitzar validacions existents.
        }
    }, "L'email introduït no és vàlid!").refine(async (el) => {
        if (el === undefined || el === null) return true;
        return await emailExists(el);
    }),
    password: z.string({error: "La contrasenya introduïda no és vàlida! Ha de ser un text"}).min(8, "La contrasenya ha de contenir al menys 8 caràcters!").optional()
});
