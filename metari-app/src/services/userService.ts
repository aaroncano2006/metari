import { axiosConnection } from "./axiosConnection"
import type { userTypeDTO } from "../types/userTypeDTO"
import type { userTypeFrontend } from "../types/userTypeFrontend"
import { mapUser } from "../mapper/userMapper"

export async function fetchUsers(): Promise<userTypeFrontend[]> {
  const { data } = await axiosConnection.get<userTypeDTO[]>("/usuaris")
  return data.map(mapUser)
}