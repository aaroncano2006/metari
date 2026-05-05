import { useEffect, useState } from "react"
import { axiosConnection } from "./axiosConnection"
import type { userTypeDTO } from "../types/userTypeDTO"
import type { userTypeFrontend } from "../types/userTypeFrontend"
import { mapUser } from "../mapper/userMapper"

export function useUsers() {
  const [users, setUsers] = useState<userTypeFrontend[]>([])

  useEffect(() => {
    async function load() {
      const { data } = await axiosConnection.get<userTypeDTO[]>("/usuaris")
      setUsers(data.map(mapUser))
    }

    load()
  }, [])

  return users
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