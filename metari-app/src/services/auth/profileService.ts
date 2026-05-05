import { axiosConnection } from "../axiosConnection";
import type { profileType } from "../../types/auth/profileType";
import { fetchLogin, getUserId } from "./loginService";
import { mapLogin } from "../../mapper/auth/loginMapper";

export async function updateProfile (data: profileType): Promise<any> {
    const loggedUserId = getUserId();
    const updateUser = await axiosConnection.put(`/usuaris/${loggedUserId}`, data);
    let response = null;

    if (updateUser) {
        const loginData = mapLogin(data);
        response = await fetchLogin(loginData);
    }

    return response;
}