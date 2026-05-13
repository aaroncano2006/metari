import { z } from "zod";
import { fetchUsers } from "../../services/userService";

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, {error: "El nom no pot estar buit!"}),
  username: z
    .string()
    .min(5, {error: "El nom d'usuari ha de ser com a mínim 5 caràcters de llarg!"})
    .max(20, {error: "El nom d'usuari ha de ser com a màxim 20 caràcters de llarg!"})
    .refine(
      (el) => !el || /^[a-zA-Z0-9]+$/.test(el),
      "El nom d'usuari només pot contenir lletres i números!",
    )
    .refine(async (el) => {
      const users = await fetchUsers();
      const user = users.find((u) => u.username === el);
      return !user ? true : false;
    }, "El nom d'usuari introduït ja està registrat al sistema."),
  email: z
    .string()
    .email("L'email introduït no és vàlid!")
    .refine(async (el) => {
      const users = await fetchUsers();
      const user = users.find((u) => u.email === el);
      return !user ? true : false;
    }, "L'email introduït ja està registrat al sistema."),
  password: z
    .string()
    .min(8, {error: "La contrasenya ha de tenir com a mínim 8 caràcters!"}),
  repeat_password: z
    .string()
    .min(8, {error: "La contrasenya ha de tenir com a mínim 8 caràcters!"}),
});
