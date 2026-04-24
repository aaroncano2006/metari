import type { userTypeDTO } from "../types/userTypeDTO"
import type { userTypeFrontend } from "../types/userTypeFrontend"

export function mapUser(userDto: userTypeDTO): userTypeFrontend {
  return {
    id: userDto.id,
    name: userDto.name,
    username: userDto.username,
    email: userDto.email,
    role: userDto.role,
    completed_tasks: userDto.completed_tasks,
    score: userDto.score,
    created_at: userDto.created_at,
    updated_at: userDto.updated_at

  }
}