import { axiosConnection } from "../axiosConnection"
import type { loginType } from "../../types/auth/loginType";
// import { useEffect, useState } from "react"

export async function fetchLogin(): Promise<loginType> {
    const { data } = await axiosConnection.post<loginType>("/login");
    return data;
}