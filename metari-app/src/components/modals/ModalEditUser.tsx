import { useState } from "react"

import type { userTypeFrontend } from "../../types/userTypeFrontend"
import { updateUser } from "../../services/userService"
import { createUserSchema } from "../../schemas/userSchema"


type ModalEditProps = {
  user: userTypeFrontend
  setEditUser: React.Dispatch<React.SetStateAction<userTypeFrontend | null>>
  setter: React.Dispatch<React.SetStateAction<userTypeFrontend[]>>
}

export function ModalEditUser({ user, setEditUser, setter }: ModalEditProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const userTypeOptions: userTypeFrontend["role"][] = ["user", "admin"];

  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    completed_tasks: user.completed_tasks,
    score: user.score
  })

  return (
    <>
      <div className="modalOverlay h-100 w-100">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-6">
              <div className="modalWindow">
                <h5>Edita Usuari</h5>

                <form onSubmit={async (event) => {
                  event.preventDefault()

                  const userSchema = createUserSchema(user.id);
                  const validation = await userSchema.safeParseAsync(formData)

                  if (!validation.success) {
                    const errors: Record<string, string> = {}

                    validation.error.issues.forEach((issue) => {
                      const field = issue.path[0] as string
                      errors[field] = issue.message
                    })

                    setErrors(errors)
                    return
                  }
                  setErrors({})

                  const updatedUser = await updateUser(user.id, formData)

                  setter(prev =>
                    prev.map(users =>
                      users.id === user.id
                        ? updatedUser
                        : users
                    )
                  )

                  setEditUser(null)

                }}
                >
                  <label htmlFor="name">Nom</label>
                  <input className="form-control mb-2"
                    type="text" value={formData.name} id="name"
                    onChange={(event) =>
                      setFormData({ ...formData, name: event.target.value })
                    }
                  />
                  {errors.name && (
                    <small className="text-danger d-flex mb-2">{errors.name}</small>
                  )}

                  <label htmlFor="username">Nom usuari</label>
                  <input className="form-control mb-2"
                    type="text" value={formData.username} id="username"
                    onChange={(event) =>
                      setFormData({ ...formData, username: event.target.value })
                    }
                  />
                  {errors.username && (
                    <small className="text-danger d-flex mb-2">{errors.username}</small>
                  )}

                  <label htmlFor="email">Email</label>
                  <input className="form-control mb-2"
                    type="text" value={formData.email} id="email"
                    onChange={(event) =>
                      setFormData({ ...formData, email: event.target.value })
                    }
                  />
                  {errors.email && (
                    <small className="text-danger d-flex mb-2">{errors.email}</small>
                  )}


                  <div className="d-flex flex-column">
                    <label htmlFor="type">Tipus</label>
                    <select className="form-select mb-2" value={formData.role} name="type" id="type"
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          role: event.target.value as "user" | "admin",
                        })
                      }>

                      {userTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <label htmlFor="completed_tasks">Tasques completades</label>
                  <input className="form-control mb-2"
                    type="number" value={formData.completed_tasks} id="completed_tasks"
                    onChange={(event) =>
                      setFormData({ ...formData, completed_tasks: Number(event.target.value) })
                    }
                  />
                  {errors.completed_tasks && (
                    <small className="text-danger d-flex mb-2">{errors.completed_tasks}</small>
                  )}

                  <label htmlFor="score">Puntuacio de challanges</label>
                  <input className="form-control mb-2"
                    type="number" value={formData.score} id="score"
                    onChange={(event) =>
                      setFormData({ ...formData, score: Number(event.target.value) })
                    }
                  />
                  {errors.score && (
                    <small className="text-danger d-flex mb-2">{errors.score}</small>
                  )}

                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-secondary"
                      type="button"
                      onClick={() => setEditUser(null)}
                    >
                      Cancela
                    </button>

                    <button type="submit" className="btn btn-primary">
                      Actualitza
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}