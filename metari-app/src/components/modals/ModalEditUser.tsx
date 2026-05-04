import { useState } from "react"

import type { userTypeFrontend } from "../../types/userTypeFrontend"
import { updateUser } from "../../services/userService"


type ModalEditProps = {
  user: userTypeFrontend
  setEditUser: React.Dispatch<React.SetStateAction<userTypeFrontend | null>>
  setter: React.Dispatch<React.SetStateAction<userTypeFrontend[]>>
}

export function ModalEditUser({ user, setEditUser, setter }: ModalEditProps) {

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
                  <input className="form-control mb-2"
                    type="text" value={formData.name}
                    onChange={(event) =>
                      setFormData({ ...formData, name: event.target.value })
                    }
                  />

                  <input className="form-control mb-2"
                    type="text" value={formData.username}
                    onChange={(event) =>
                      setFormData({ ...formData, username: event.target.value })
                    }
                  />

                  <input className="form-control mb-2"
                    type="text" value={formData.email}
                    onChange={(event) =>
                      setFormData({ ...formData, email: event.target.value })
                    }
                  />

                  <input className="form-control mb-2"
                    type="text" value={formData.role}
                    onChange={(event) =>
                      setFormData({ ...formData, role: event.target.value as "user" | "admin" })
                    }
                  />

                  <input className="form-control mb-2"
                    type="number" value={formData.completed_tasks}
                    onChange={(event) =>
                      setFormData({ ...formData, completed_tasks: Number(event.target.value) })
                    }
                  />


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