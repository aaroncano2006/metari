import { axiosConnection } from "../axiosConnection";
import type { loginType } from "../../types/auth/loginType";

export async function fetchLogin(data: loginType): Promise<any> {
  const response = await axiosConnection.post("/login", data);
  return response.data;
}

export function getUserRole(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.role;
}