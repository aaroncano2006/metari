import { useState, useEffect } from "react"

import type { groupType } from "../../types/groupType"
import { updateGroup } from "../../services/groupService"
// import { fetchUsers } from "../../services/userService"
import { fetchGroupById } from "../../services/groupService"
import type { groupUserType } from "../../types/groupUserType"
import { groupSchema } from "../../schemas/groupSchema"





type ModalEditProps = {
  group: groupType
  setEditGroup: React.Dispatch<React.SetStateAction<groupType | null>>
  setter: React.Dispatch<React.SetStateAction<groupType[]>>
}




export function ModalEditGroup({ group, setEditGroup, setter }: ModalEditProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})


  const [formData, setFormData] = useState({
    name: group.name,
    description: group.description,
    owner_id: group.owner_id,
    is_public: group.is_public,

  })

  const [usersGroup, setUsersGroup] = useState<any>(null)


  useEffect(() => {
    const loadGroup = async () => {
      const data = await fetchGroupById(group.id)
      setUsersGroup(data)
    }

    loadGroup()
  }, [])

  const users = usersGroup?.groupUsers?.map((groupUsers: groupUserType) => groupUsers.user) ?? []

  return (
    <>
      <div className="modalOverlay h-100 w-100">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-8 col-md-6 col-xl-4">
              <div className="modalWindow bg-form p-4">
                <h5 className="tiltWarp">Edita el Grup</h5>

                <form onSubmit={async (event) => {
                  event.preventDefault()

                  const validation = groupSchema.safeParse(formData)

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

                  const updatedGroup = await updateGroup(group.id, formData)

                  try {
                    const updatedGroup = await updateGroup(group.id, formData)
                    setter(prev =>
                      prev.map(groups =>
                        groups.id === group.id
                          ? updatedGroup
                          : groups
                      )
                    )
                    setEditGroup(null)
                    alert("Grup actualitzat correctament")
                  } catch (error) {
                    alert("Error en actualitzar el grup")
                  }

                }}
                >
                  <label htmlFor="name"><strong>Nom:</strong></label>
                  <input className="form-control mb-2"
                    type="text" value={formData.name} id="name"
                    onChange={(event) =>
                      setFormData({ ...formData, name: event.target.value })
                    }
                  />
                  {errors.name && (
                    <small className="text-danger d-flex mb-2">{errors.name}</small>
                  )}

                  <label htmlFor="description"><strong>Descripció:</strong></label>
                  <textarea className="form-control mb-2"
                    value={formData.description} id="description"
                    onChange={(event) =>
                      setFormData({ ...formData, description: event.target.value })
                    }
                  />
                  {errors.description && (
                    <small className="text-danger d-flex mb-2">{errors.description}</small>
                  )}

                  <label htmlFor="owner"><strong>Autor del grup:</strong></label>
                  <select
                    className="form-select mb-2"
                    value={formData.owner_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        owner_id: Number(e.target.value),
                      })
                    }
                  >
                    {users.map((user: any) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>

                    <div className="d-flex">

                  <label htmlFor="is_public"><strong>El grup es públic?</strong></label>
                  <input className=" form-check mb-2 ms-3"
                    type="checkbox" id="is_public" checked={formData.is_public}
                    onChange={(event) =>
                      setFormData({ ...formData, is_public: event.target.checked })
                    }
                    />
                    </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-secondary"
                      type="button"
                      onClick={() => setEditGroup(null)}
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