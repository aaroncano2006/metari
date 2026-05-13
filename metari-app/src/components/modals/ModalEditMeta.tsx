import type { metaType } from "../../types/metaType"
import { useState, useEffect } from "react"
import { fetchCategories } from "../../services/categoryService"



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
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
      const loadCategories = async () => {
        const data = await fetchCategories()
        setCategories(data)
      }
  
      loadCategories()
    }, [])

  const [formData, setFormData] = useState({
  title: meta.title,
  description: meta.description ?? undefined,
  author_id: meta.author_id,
  group_id: meta.group_id ?? undefined,
  category_id: meta.category_id ?? undefined,
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

                  //validacions zod
                  const validation = metaSchema.safeParse(formData)

                  if (!validation.success) {
                    const errors: Record<string, string> = {}

                    validation.error.issues.forEach((issue) => {
                      const field = issue.path[0] as string
                      errors[field] = issue.message
                    })

                    setErrors(errors)
                    return
                  }
                  // netejem errors de les validacions, si no hi ha.
                  setErrors({})

                  const updatedMeta = await updateMeta(meta.id, validation.data)

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
                    <label htmlFor="category">Categoria</label>
                    <select className="form-select mb-2" value={formData.category_id} name="category" id="category"
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          category_id: Number(event.target.value)
                        })
                      }>
                        {categories.map((category: any) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                    </select>
                  </div>




                  <div className="d-flex flex-column">
                    <label htmlFor="type">Tipus</label>
                    <select className="form-select mb-2" value={formData.type} name="type" id="type"
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          type: event.target.value as "task" | "challenge",
                        })
                      }>

                      {metaTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* {errors.type && (
                    <small className="text-danger d-flex mb-2">{errors.type}</small>
                  )} */}

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