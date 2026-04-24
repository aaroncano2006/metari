import { useEffect, useState } from "react"
import { fetchUsers } from "../services/userService"
import { UserList } from "../components/UserList"
import type { userTypeFrontend } from "../types/userTypeFrontend"

export default function Home() {
  const [users, setUsers] = useState<userTypeFrontend[]>([])

  useEffect(() => {
    fetchUsers().then(setUsers)
  }, [])

  return (
    <>
      <h1 className="bg-warning text-center">Benvingut a Metari</h1>
      
      <UserList users={users} />
    </>
  )
}