import { axiosConnection } from "../axiosConnection";
import type { profileType } from "../../types/auth/profileType";
import { getUserId } from "./loginService";

export async function updateProfile (data: profileType): Promise<any> {
    const loggedUserId = getUserId();
    const updateUser = await axiosConnection.put(`/usuaris/${loggedUserId}`, data);
    let response = null;

    if (updateUser?.data?.token) {
        response = { token: updateUser.data.token };
    }

    return response;
}