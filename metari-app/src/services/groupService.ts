import { axiosConnection } from "./axiosConnection"
import type { groupType } from "../types/groupType";



export async function fetchGroups(): Promise<groupType[]> {
  const { data } = await axiosConnection.get<groupType[]>("/grups");

  return data;
}

export async function fetchGroupsByUserId(userId: number): Promise<groupType[]> {
  const { data } = await axiosConnection.get<groupType[]>(`/grups/user/${userId}`);
  return data;
}

export async function fetchGroupById(id: number): Promise<groupType> {
  const { data } = await axiosConnection.get<groupType>(`/grups/${id}`);
  return data;
}

export async function createGroup(newUser: Partial<groupType>): Promise<groupType> {
  try {
    const { data } = await axiosConnection.post<groupType>(`/grups`, newUser);
    return data;
    
  } catch (error) {
    console.error("Error creant grup:", error);
    throw error;
  }

}

export async function updateGroup(id: number, updatedData: Partial<groupType>): Promise<groupType> {
  try {
    const { data } = await axiosConnection.put<groupType>(`/grups/${id}`, updatedData)
    return data

  } catch (error) {
    console.error("Error actualitzant grup:", error)
    throw error
  }
}

export async function deleteGroup(id: number): Promise<void> {
  try {
    await axiosConnection.delete(`/grups/${id}`);
  } catch (error) {
    console.error("Error eliminant grup:", error);
  }
  
}