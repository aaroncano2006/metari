// src/hooks/useUsers.ts
import { useEffect, useState } from "react"
// import { fetchUsers } from "../services/userService"
import type { userTypeFrontend } from "../types/userTypeFrontend"

export function allUsers() {
  const [users, setUsers] = useState<userTypeFrontend[]>([])

  useEffect(() => {
    // fetchUsers().then(setUsers)
  }, [])

  return users
}