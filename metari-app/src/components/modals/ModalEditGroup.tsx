import { useState } from "react"

import { updateUser } from "../../services/userService"
import type { groupType } from "../../types/groupType"
import { updateGroup } from "../../services/groupService"
// import { fetchUsers } from "../../services/userService"





type ModalEditProps = {
  group: groupType
  setEditGroup: React.Dispatch<React.SetStateAction<groupType | null>>
  setter: React.Dispatch<React.SetStateAction<groupType[]>>
}

export function ModalEditGroup({ group, setEditGroup, setter }: ModalEditProps) {

  //  const usersGroup = fetchUsers()


  const [formData, setFormData] = useState({
    name: group.name,
    description: group.description,
    owner_id: group.owner_id,
    is_public: group.is_public,

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

                  const updatedGroup = await updateGroup(group.id, formData)

                  setter(prev =>
                    prev.map(groups =>
                      groups.id === group.id
                        ? updatedGroup
                        : groups
                    )
                  )

                  setEditGroup(null)

                }}
                >
                  <label htmlFor="name">Nom</label>
                  <input className="form-control mb-2"
                    type="text" value={formData.name} id="name"
                    onChange={(event) =>
                      setFormData({ ...formData, name: event.target.value })
                    }
                  />
                  <label htmlFor="description">Descripcio</label>

                  <textarea className="form-control mb-2"
                    value={formData.description} id="description"
                    onChange={(event) =>
                      setFormData({ ...formData, description: event.target.value })
                    }
                  />
                  <label htmlFor="owner_id">Autor del grup</label>

                  <input className="form-control mb-2"
                    type="number" value={formData.owner_id} id="owner_id"
                    onChange={(event) =>
                      setFormData({ ...formData, owner_id: Number(event.target.value) })
                    }
                  />

                  <label htmlFor="is_public">El grup es public?</label>
                  <input className=" form-check mb-2"
                    type="checkbox" id="is_public" checked={formData.is_public}
                    onChange={(event) =>
                      setFormData({ ...formData, is_public: event.target.checked })
                    }
                  />







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