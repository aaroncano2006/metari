import { axiosConnection } from "./axiosConnection"
import type { userTypeFrontend } from "../types/userTypeFrontend"



export async function fetchFriends(userId: number): Promise<userTypeFrontend[]> {
  const { data } = await axiosConnection.get<userTypeFrontend[]>(`/invitacions/friends/${userId}`)
  return data
}

export async function sendInvitation(senderId: number, receiverId: number, groupId: number | null): Promise<any> {
  let BASE_URL = `/invitacions/${senderId}/${receiverId}`;
  if (groupId) {
    BASE_URL = BASE_URL + `/${groupId}`;
  }

  const { data } = await axiosConnection.post(BASE_URL);
  return data;
}