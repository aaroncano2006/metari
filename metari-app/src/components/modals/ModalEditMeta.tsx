import type { metaType } from "../../types/metaType"
import { useState } from "react"



import { updateMeta } from "../../services/metaService"
import { metaSchema } from "../../schemas/metaSchema"


type ModalEditProps = {
  meta: metaType
  setEditMeta: React.Dispatch<React.SetStateAction<metaType | null>>
  setter: React.Dispatch<React.SetStateAction<metaType[]>>
}

export function ModalEditMeta({ meta, setEditMeta, setter }: ModalEditProps) {

  const [errors, setErrors] = useState<Record<string, string>>({})
  const metaTypeOptions: metaType["type"][] = ["task", "challenge"];

  const [formData, setFormData] = useState({
    title: meta.title,
    description: meta.description,
    author_id: meta.author_id,
    group_id: meta.group_id,
    category_id: meta.category_id,
    type: meta.type,
  })


  return (
    <>
      <div className="modalOverlay h-100 w-100">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-6">
              <div className="modalWindow">
                <h5>Edita Meta</h5>

                <form onSubmit={async (event) => {
                  event.preventDefault()

                  const result = metaSchema.safeParse(formData)

                  if (!result.success) {
                    const errors: Record<string, string> = {}

                    result.error.issues.forEach((issue) => {
                      const field = issue.path[0] as string
                      errors[field] = issue.message
                    })

                    setErrors(errors)
                    return
                  }
                  // netejem errors si no hi ha
                  setErrors({})

                  const updatedMeta = await updateMeta(meta.id, formData)

                  setter(prev =>
                    prev.map(metas =>
                      metas.id === meta.id
                        ? updatedMeta
                        : metas
                    )
                  )

                  setEditMeta(null)

                }}
                >
                  <label htmlFor="title">Titol</label>
                  <input className="form-control "
                    type="text" value={formData.title} id="title"
                    onChange={(event) =>
                      setFormData({ ...formData, title: event.target.value })
                    }
                  />
                  {errors.title && (
                    <small className="text-danger d-flex mb-2">{errors.title}</small>
                  )}

                  <label htmlFor="description">Descripcio</label>
                  <textarea className="form-control "
                    value={formData.description} id="description"
                    onChange={(event) =>
                      setFormData({ ...formData, description: event.target.value })
                    }
                  />
                  {errors.description && (
                  <small className="text-danger d-flex mb-2">{errors.description}</small>
                )}

                  <div className="d-flex flex-column">
                    <label htmlFor="type">Tipus</label>
                    <select className="form-select mb-2" name="type" id="type">

                      {metaTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                     {errors.type && (
                    <small className="text-danger d-flex mb-2">{errors.type}</small>
                  )}

                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-secondary"
                      type="button"
                      onClick={() => setEditMeta(null)}
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