import type { categoryType } from "../types/categoryType"
import { useState } from "react"

type CategoryListProps = {
  categories: categoryType[]
}

export function CategoryList({ categories }: CategoryListProps) {

  const [openEntityId, setOpenEntityId] = useState<number | null>(null)
  const toggleEntity = (id: number) => {
    setOpenEntityId(prev => (prev === id ? null : id))
  }
  
  const [editCategory, setEditCategory] = useState<categoryType | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  })


  return (

    <>
      <div className="metaList ">
        <div className="titolComponent text-center my-2">Llista de Categories</div>
        <hr className="m-0" />

        <div className="inline">
          <ul className=" ps-4  m-0  py-2">
            {categories.map((category) => (
              <li key={category.id} className="m-0 p-0" >
                <div className={`metaEntry mt-1 me-3 ps-2 ${openEntityId === category.id ? "mb-0" : "mb-1"}`}
                  onClick={() => toggleEntity(category.id)}>

                  <div className="d-flex py-1 ps-2 pe-3 align-items-center">
                    {category.name}
                    <button className="  btn btn-warning p-1  me-2  ms-auto"
                      onClick={(event) => {
                        event.stopPropagation()
                        setEditCategory(category)
                        setFormData({
                          name: category.name,
                          description: category.description
                        })
                      }}>Edita</button>
                    <button className="  btn btn-danger p-1   "
                      onClick={async (event) => {
                        event.stopPropagation()
                      }}>X</button>
                  </div>
                </div>
                <div className=" metaDetailsBox  my-0 me-3">
                  {openEntityId === category.id && (
                    <div className="metaDetails ps-2 py-2">
                      {/* Replace with real fields */}
                      <div>ID: {category.id}</div>
                      <div>Descripcio: {category.description}</div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {editCategory && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h5>Edit Category</h5>

            <form onSubmit={(event) => {
                event.preventDefault()
                setEditCategory(null)
              }}
            >
              <input className="form-control mb-2"
                type="text" value={formData.name}
              />

              <textarea className="form-control mb-2"
                value={formData.description}
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
      )}
    </>

  );
}