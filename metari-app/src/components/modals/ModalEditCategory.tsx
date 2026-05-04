import type { categoryType } from "../../types/categoryType"
import { useState } from "react"

import { updateCategory } from "../../services/categoryService"


type ModalEditProps = {
  category: categoryType
  setEditCategory: React.Dispatch<React.SetStateAction<categoryType | null>>
  setter: React.Dispatch<React.SetStateAction<categoryType[]>>
}

export function ModalEditCategory({ category, setEditCategory, setter }: ModalEditProps) {

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
                <h5>Edit Category</h5>

                <form onSubmit={async (event) => {
                  event.preventDefault()

                  const updatedCategory = await updateCategory(category.id, formData)

                  setter(prev =>
                    prev.map(categories =>
                      categories.id === category.id
                        ? updatedCategory
                        : categories
                    )
                  )

                  setEditCategory(null)

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