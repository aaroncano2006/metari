import type { categoryType } from "../../types/categoryType"
import { useState } from "react"


type ModalEditProps = {
  category: categoryType
  //generalitzar (setter)
  setEditCategory: React.Dispatch<React.SetStateAction<categoryType | null>>
}

export function ModalEdit({ category, setEditCategory }: ModalEditProps) {

  //fer-lo generalitzat
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

                <form onSubmit={(event) => {
                  event.preventDefault()
                  setEditCategory(null)
                }}
                >
                  <input className="form-control mb-2"
                    type="text" value={formData.name}
                    onChange={(event) =>
                      setFormData({ ...formData, name: event.target.value })
                    }
                  />

                  <textarea className="form-control mb-2"
                    value={formData.description}
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