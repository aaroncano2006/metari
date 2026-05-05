import { axiosConnection } from "./axiosConnection"

import type { groupUserType } from "../types/groupUserType";



export async function fetchGroupUsers(): Promise<groupUserType[]> {
  const { data } = await axiosConnection.get<groupUserType[]>("/grups-usuaris");

  return data;
}

