import { axiosConnection } from "./axiosConnection"
import type { userTypeFrontend } from "../types/userTypeFrontend"



export async function fetchFriends(userId: number): Promise<userTypeFrontend[]> {
  const { data } = await axiosConnection.get<userTypeFrontend[]>(`/invitacions/friends/${userId}`)
  return data
}
