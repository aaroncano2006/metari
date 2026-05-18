import {z} from "zod";

export const loginSchema = z.object({
    email_or_username: z.string().refine((el) => {
        if (el.includes("@")) {
            return z.string().email().safeParse(el).success; // Utilitzem safeParse per validar sense llençar errors i reutilitzar validacions existents.
        }
        return z.string().min(5).max(20).safeParse(el).success;
    }, "Introdueix un email vàlid o un nom d'usuari de com a mínim 5 caràcters i màxim 20 caràcters!"),
    password: z.string().min(8, "La contrasenya ha de ser mínim de 8 caràcters")
});