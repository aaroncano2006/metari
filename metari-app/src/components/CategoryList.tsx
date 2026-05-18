import type { categoryType } from "../types/categoryType"
import { useState } from "react"
import { ModalEditCategory } from "./modals/ModalEditCategory"
import { deleteCategory } from "../services/categoryService"

import { getUserRole } from "../services/auth/loginService"
import { useLocation } from "react-router-dom";


type CategoryListProps = {
  categories: categoryType[]
  setter: React.Dispatch<React.SetStateAction<categoryType[]>>
  filteredCategory?: number | null
  setFilteredCategory?: React.Dispatch<React.SetStateAction<number | null>>
}


export function CategoryList({ categories, setter, filteredCategory, setFilteredCategory }: CategoryListProps) {

  const [openEntitySelected, setOpenEntitySelected] = useState<number | null>(null)
  const toggleEntity = (id: number) => {
    setOpenEntitySelected(prev => (prev === id ? null : id))
  }

  const [categoryToEdit, setCategoryToEdit] = useState<categoryType | null>(null)
  // const [filteredCategory, setFilteredCategory] = useState<number | null>(null)

  const role = getUserRole()
  const vistaActual = useLocation().pathname;
 const canEdit =
  (vistaActual !== "/" && vistaActual !== "/search" && vistaActual !== "/mygroups" && vistaActual !== "/mymetas") &&
  role === "admin";



  return (

    <>
      <div className="metaList mt-4">
        <div className="titolComponent text-center my-2">Llista de Categories</div>
        <hr className="m-0" />

        <div className="inline">
          <ul className=" ps-2  m-0  py-2">
            {categories.map((category) => (
              <li key={category.id} className="m-0 p-0" >
                <div className={`metaEntry mt-1 me-3 ps-2 ${openEntitySelected === category.id ? "mb-0" : "mb-1"}`}
                  onClick={() => toggleEntity(category.id)}>

                  <div className="d-flex py-1 ps-2 pe-2 align-items-center">
                    <div className="me-auto">{category.name}</div>
                    {(vistaActual === "/" || vistaActual === "/search") && setFilteredCategory &&  
                      <input
                        type="checkbox"
                        checked={filteredCategory === category.id}
                        onClick={(event) => {
                          event.stopPropagation()                          
                          setFilteredCategory(prev =>
                            prev === category.id ? null : category.id
                          )
                        }}
                        
                      />
                    }
                    {canEdit &&
                      <button className="  btn btn-warning p-1  me-2  ms-auto"
                        onClick={(event) => {
                          event.stopPropagation()
                          //indica quina categoria estem editant, si hi ha una, obra el modal.
                          setCategoryToEdit(category)
                        }}>Edita</button>
                    }
                    {canEdit &&
                      <button className="  btn btn-danger p-1   "
                        onClick={async (event) => {
                          event.stopPropagation()
                          await deleteCategory(category.id)
                          setter(prev => prev.filter(prevCategory => prevCategory.id !== category.id))
                        }}>X</button>
                    }
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
        <ModalEditCategory category={categoryToEdit} setEditCategory={setCategoryToEdit} setter={setter} />
      )}
    </>

  );
}