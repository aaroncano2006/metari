import type { categoryType } from "../types/categoryType"
import { useState } from "react"
import { ModalEdit } from "./modals/ModalEdit"

type CategoryListProps = {
  categories: categoryType[]
}

export function CategoryList({ categories }: CategoryListProps) {

  const [openEntitySelected, setOpenEntitySelected] = useState<number | null>(null)
  const toggleEntity = (id: number) => {
    setOpenEntitySelected(prev => (prev === id ? null : id))
  }

  const [categoryToEdit, setCategoryToEdit] = useState<categoryType | null>(null)
 


  return (

    <>
      <div className="metaList ">
        <div className="titolComponent text-center my-2">Llista de Categories</div>
        <hr className="m-0" />

        <div className="inline">
          <ul className=" ps-4  m-0  py-2">
            {categories.map((category) => (
              <li key={category.id} className="m-0 p-0" >
                <div className={`metaEntry mt-1 me-3 ps-2 ${openEntitySelected === category.id ? "mb-0" : "mb-1"}`}
                  onClick={() => toggleEntity(category.id)}>

                  <div className="d-flex py-1 ps-2 pe-3 align-items-center">
                    {category.name}
                    <button className="  btn btn-warning p-1  me-2  ms-auto"
                      onClick={(event) => {
                        event.stopPropagation()
                        setCategoryToEdit(category)
                        
                      }}>Edita</button>
                    <button className="  btn btn-danger p-1   "
                      onClick={async (event) => {
                        event.stopPropagation()
                      }}>X</button>
                  </div>
                </div>
                <div className=" metaDetailsBox  my-0 me-3">
                  {openEntitySelected === category.id && (
                    <div className="metaDetails ps-2 py-2">
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

      {/* modal editar */}
      {categoryToEdit && (
        <ModalEdit category={categoryToEdit} setEditCategory={setCategoryToEdit}/>
      )}
    </>

  );
}