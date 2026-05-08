import { axiosConnection } from "../axiosConnection";
import type { restorePasswordType } from "../../types/auth/restorePasswordType";

export async function fetchRestorePassword(data: restorePasswordType) {
    const response = await axiosConnection.post("/restore-password/restore", data);
    return response.data;
}