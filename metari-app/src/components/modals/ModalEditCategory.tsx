import type { categoryType } from "../../types/categoryType"
import { useState } from "react"

import { updateCategory } from "../../services/categoryService"
import { categorySchema } from "../../schemas/categorySchema"


type ModalEditProps = {
  category: categoryType
  setEditCategory: React.Dispatch<React.SetStateAction<categoryType | null>>
  setter: React.Dispatch<React.SetStateAction<categoryType[]>>
}

export function ModalEditCategory({ category, setEditCategory, setter }: ModalEditProps) {

  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    name: category.name,
    description: category.description
  })


  return (
    <>
      <div className="modalOverlay h-100 w-100">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-6">
              <div className="modalWindow">
                <h5>Edita categoria</h5>

                <form onSubmit={async (event) => {
                  event.preventDefault()

                  const validation = categorySchema.safeParse(formData)

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

                  try {
                    const updatedCategory = await updateCategory(category.id, formData)
                    setter(prev =>
                      prev.map(categories =>
                        categories.id === category.id
                          ? updatedCategory
                          : categories
                      )
                    )
                    setEditCategory(null)
                    alert("Categoria actualitzada correctament")
                  } catch (error) {
                    alert("Error en actualitzar la categoria")
                  }

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
                  <label htmlFor="description">Descripcio</label>
                  <textarea className="form-control mb-2"
                    value={formData.description} id="description"
                    onChange={(event) =>
                      setFormData({ ...formData, description: event.target.value })
                    }
                  />
                  {errors.description && (
                    <small className="text-danger d-flex mb-2">{errors.description}</small>
                  )}

                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-secondary"
                      type="button"
                      onClick={() => setEditCategory(null)}
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