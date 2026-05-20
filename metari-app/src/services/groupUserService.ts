import { axiosConnection } from "./axiosConnection"

import type { groupUserType } from "../types/groupUserType";



export async function fetchGroupUsers(): Promise<groupUserType[]> {
  const { data } = await axiosConnection.get<groupUserType[]>("/grups-usuaris");

  return data;
}

export async function createGroupUser(data: { group_id: number; user_id: number; role: string }): Promise<groupUserType> {
  const { data: response } = await axiosConnection.post<groupUserType>("/grups-usuaris", data);
  return response;
}

export async function updateGroupUserRole(groupId: number, userId: number, role: string): Promise<groupUserType> {
  const { data } = await axiosConnection.put<groupUserType>(`/grups-usuaris/${groupId}/${userId}`, { role });
  return data;
}

export async function deleteGroupUser(groupId: number, userId: number): Promise<void> {
  await axiosConnection.delete(`/grups-usuaris/${groupId}/${userId}`);
}

