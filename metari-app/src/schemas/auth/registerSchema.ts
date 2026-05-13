import { z } from "zod";
import { fetchUsers } from "../../services/userService";

export const registerSchema = z.object({
  name: z
    .string()
    .refine((el) => !el || el.trim().length > 0, "El nom no pot estar buit!"),
  username: z
    .string()
    .refine(
      (el) => !el || el.length >= 5,
      "El nom d'usuari ha de ser com a mínim 5 caràcters!",
    )
    .refine(
      (el) => !el || /^[a-zA-Z0-9]+$/.test(el),
      "El nom d'usuari només pot contenir lletres i números!",
    )
    .refine(async (el) => {
      const users = await fetchUsers();
      const user = users.find((u) => u.username === el);
      return user ? true : false;
    }, "El nom d'usuari introduït ja està registrat al sistema."),
  email: z
    .string()
    .email("L'email introduït no és vàlid!")
    .refine(async (el) => {
      const users = await fetchUsers();
      const user = users.find((u) => u.email === el);
      return user ? true : false;
    }, "L'email introduït ja està registrat al sistema."),
  password: z
    .string()
    .refine(
      (el) => !el || el.length >= 8,
      "La contrasenya ha de tenir almenys 8 caràcters!",
    ),
  repeat_password: z
    .string()
    .refine(
      (el) => !el || el.length >= 8,
      "La contrasenya ha de tenir almenys 8 caràcters!",
    ),
});
