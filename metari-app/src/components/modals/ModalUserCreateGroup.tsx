import { useState } from "react"
import type { groupType } from "../../types/groupType"
import { groupSchema } from "../../schemas/groupSchema"
import { getUserId } from "../../services/auth/loginService"
import { createGroup } from "../../services/groupService"
import { createGroupUser } from "../../services/groupUserService"


type ModalProps = {
  setCreatingGroup: React.Dispatch<React.SetStateAction<boolean>>
  setGroups: React.Dispatch<React.SetStateAction<groupType[]>>
}
export function ModalUserCreateGroup({ setCreatingGroup, setGroups }: ModalProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPublic, setIsPublic] = useState<boolean>(true)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const userId = getUserId()
    if (!userId) return

    const formData = new FormData(event.currentTarget)
    const groupData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      is_public: formData.get("is_public") !== null,
    }
    const validation = groupSchema.safeParse(groupData)
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    const newGroup = await createGroup({
      ...validation.data,
      owner_id: userId,
    })
    setGroups(prev => [...prev, newGroup])

    await createGroupUser({
      group_id: newGroup.id,
      user_id: userId,
      role: "moderator",
    })

    setCreatingGroup(false)


  }
  return (
    <>
      <div className="modalOverlay h-100 w-100">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-6">
              <div className="modalWindow">
                <h5>Crea un grup</h5>
                <form onSubmit={handleSubmit}>
                  <div className="d-flex flex-column">
                    <label htmlFor="name">Nom</label>
                    <input className="form-control mb-2" type="text" name="name" id="name" />
                  </div>
                  {errors.name && (
                    <small className="text-danger d-block mb-2">{errors.name}</small>
                  )}
                  <div className="d-flex flex-column">
                    <label htmlFor="description">Descripció</label>
                    <textarea className="form-control mb-2" name="description" id="description" />
                  </div>
                  {errors.description && (
                    <small className="text-danger d-block mb-2">{errors.description}</small>
                  )}
                  <div>
                    <label className="me-5 my-2" htmlFor="is_public">El grup es public?</label>
                    <input type="checkbox" name="is_public" id="is_public"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                    />
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-secondary"
                      type="button"
                      onClick={() => setCreatingGroup(false)}
                    >
                      Cancela
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Crea el grup
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}