import { useEffect, useState } from "react"
import { axiosConnection } from "./axiosConnection"
import type { userTypeDTO } from "../types/userTypeDTO"
import type { userTypeFrontend } from "../types/userTypeFrontend"
import { mapUser } from "../mapper/userMapper"




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
    const { data } = await axiosConnection.put<userTypeFrontend>(`/usuaris/${id}`, updatedData)
    return data

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