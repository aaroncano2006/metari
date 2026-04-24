import type { userTypeFrontend } from "../types/userTypeFrontend"

type UserProps = {
  user: userTypeFrontend
}

export function UserCard({ user }: UserProps) {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-4">
      <div className="card h-100 p-3 text-center">

        <h3 className="mb-2">{user.name}</h3>

        <p className="mb-1">
          <strong>Username:</strong> {user.username}
        </p>

        <p className="mb-1">
          <strong>Email:</strong> {user.email}
        </p>

        <p className="mb-1">
          <strong>Role:</strong> {user.role}
        </p>

        <p className="mb-1">
          <strong>Score:</strong> {user.score}
        </p>

        <p className="mb-1">
          <strong>Tasks:</strong> {user.completed_tasks}
        </p>

      </div>
    </div>
  )
}