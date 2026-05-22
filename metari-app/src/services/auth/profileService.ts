import { axiosConnection } from "../axiosConnection";
import type { profileType } from "../../types/auth/profileType";
import { getUserId } from "./loginService";
import { fetchUsers } from "../userService";

export async function updateProfile (data: profileType): Promise<any> {
    const loggedUserId = getUserId();
    const updateUser = await axiosConnection.put(`/usuaris/${loggedUserId}`, data);
    let response = null;

    if (updateUser?.data?.token) {
        response = { token: updateUser.data.token };
    }

    return response;
}

export async function getUserProfileData (username: string): Promise<any> {
    const allUsers = await fetchUsers();
    const user = allUsers.find((el) => el.username === username);
    return user || null;
}