import { axiosConnection } from "../axiosConnection";
import type { profileType } from "../../types/auth/profileType";
import { getUserId } from "./loginService";

export async function updateProfile (data: profileType): Promise<any> {
    const loggedUserId = getUserId();
    const response = await axiosConnection.put(`/usuaris/${loggedUserId}`, data);
    return response.data;
}