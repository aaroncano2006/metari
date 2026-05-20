import { axiosConnection } from "./axiosConnection"
import type { userTypeFrontend } from "../types/userTypeFrontend"
import type { userTypeDTO } from "../types/userTypeDTO";


export async function fetchUsers(): Promise<userTypeFrontend[]> {
  const { data } = await axiosConnection.get<userTypeFrontend[]>("/usuaris");

  return data;
}



export async function fetchUserById(id: number): Promise<userTypeFrontend> {
  const { data } = await axiosConnection.get<userTypeFrontend>(`/usuaris/${id}`);
  return data;
}

export async function createUser(newUser: Partial<userTypeFrontend>): Promise<userTypeFrontend> {
  try {
    const { data } = await axiosConnection.post<userTypeFrontend>(`/usuaris`, newUser);
    return data;
    
  } catch (error) {
    console.error("Error creant usuari:", error);
    throw error;
  }

}

export async function updateUser(id: number, updatedData: Partial<userTypeFrontend>): Promise<userTypeFrontend> {
  try {
    // el endpoint ara retorna user i token...
    // const { data } = await axiosConnection.put<userTypeFrontend>(`/usuaris/${id}`, updatedData)
    // return data
    const { data } = await axiosConnection.put<{ user: userTypeFrontend; token: string }>(`/usuaris/${id}`, updatedData)
  return data.user

  } catch (error) {
    console.error("Error actualitzant usuari:", error)
    throw error
  }
}

export async function deleteUser(id: number): Promise<void> {
  try {
    await axiosConnection.delete(`/usuaris/${id}`);
  } catch (error) {
    console.error("Error eliminant usuari:", error);
  }
}
  
export async function usernameExists(username: string, currentUserId?: number): Promise<boolean> {
  const response = await axiosConnection.get<userTypeDTO[]>("/usuaris");
  const userWithUsername = response.data.find((el) => el.username === username && el.id !== currentUserId);

  return !!userWithUsername;
}

export async function emailExists(email: string, currentUserId?: number): Promise<boolean> {
  const response = await axiosConnection.get<userTypeDTO[]>("/usuaris");
  const userWithEmail = response.data.find((el) => el.email === email && el.id !== currentUserId);

  return !!userWithEmail;
}