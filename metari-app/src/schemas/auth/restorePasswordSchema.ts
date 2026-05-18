import {z} from 'zod';

export const restorePasswordSchema = z.object({
    new_password: z.string().min(8, "La contrasenya ha de ser mínim de 8 caràcters"),
    confirm_password: z.string().min(8, "La contrasenya ha de ser mínim de 8 caràcters")
});