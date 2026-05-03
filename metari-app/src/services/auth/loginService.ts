import { axiosConnection } from "../axiosConnection";
import type { loginType } from "../../types/auth/loginType";

export async function fetchLogin(data: loginType): Promise<any> {
  const response = await axiosConnection.post("/login", data);
  return response.data;
}