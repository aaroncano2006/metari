import { axiosConnection } from "./axiosConnection"
import type { userTypeFrontend } from "../types/userTypeFrontend"




export async function fetchGroupUsers(): Promise<userTypeFrontend[]> {
  const { data } = await axiosConnection.get<userTypeFrontend[]>("/grups-usuaris");

  return data;
}

