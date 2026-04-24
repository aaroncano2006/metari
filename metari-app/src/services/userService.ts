import { axiosConnection } from "../services/axiosConnection"
import type { userTypeDTO } from "../types/userTypeDTO"
import type { userTypeFrontend } from "../types/userTypeFrontend"
import { mapUser } from "../mapper/userMapper"

export async function fetchUsers(): Promise<userTypeFrontend[]> {
  const { data } = await axiosConnection.get<userTypeDTO[]>("/usuaris")
  console.log("RAW API DATA:", data)
  return data.map(mapUser)
}