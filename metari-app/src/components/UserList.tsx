import type { userTypeFrontend } from "../types/userTypeFrontend"

type UserListProps = {
  users: userTypeFrontend[]
}

export function UserList({ users }: UserListProps) {
  return (
    <>

      <div className="userList ">
        <div className="titolComponent text-center">Usuaris</div>
        <hr className="my-2" />
        <ul>
          {users.map((user) => (
            <li key={user.id} className="listEntry">
              {user.username} - Punts: {user.score}
            </li>
          ))}
        </ul>

      </div>
    </>
  )
}