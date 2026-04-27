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

