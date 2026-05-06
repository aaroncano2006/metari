import { axiosConnection } from "../axiosConnection";
import type { forgotPasswordType } from "../../types/auth/forgotPasswordType";

export async function fetchForgotPassword(data: forgotPasswordType): Promise<any> {
  const response = await axiosConnection.post("/restore-password/forgot", data);
  return response.data;
}