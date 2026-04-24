import type { userTypeFrontend } from "../types/userTypeFrontend"

type UserListProps = {
  users: userTypeFrontend[]
}

export function UserList({ users }: UserListProps) {
  return (
    <div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.username} - {user.email} - {user.role} - Score: {user.score}
          </li>
        ))}
      </ul>
          <div className="test">
            holis
          </div>
    </div>
  )
}