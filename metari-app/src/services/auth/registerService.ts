import { axiosConnection } from "../axiosConnection";
import type { registerType } from "../../types/auth/registerType";
import { fetchLogin } from "./loginService";
import { mapLogin } from "../../mapper/auth/loginMapper";

export async function fetchRegister(data: registerType): Promise<any> {
    const postUser = await axiosConnection.post("/usuaris", data);
    let response = null;

    if (postUser) {
        const loginData = mapLogin(data);
        response = await fetchLogin(loginData);
    }

    return response?.data;
}