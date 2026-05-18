import type { metaType } from "../types/metaType";
import { useState } from "react"
import { ModalEditMeta } from "./modals/ModalEditMeta";
import { deleteMeta } from "../services/metaService";
import { getUserRole } from "../services/auth/loginService"
import { useLocation } from "react-router-dom";
import { ModalAddMeta } from "./modals/ModalAddMeta";
import type { groupType } from "../types/groupType";


type MetaListProps = {
  metas: metaType[]
  setter: React.Dispatch<React.SetStateAction<metaType[]>>
  filteredCategory?: number | null
  groups: groupType[]
}

export function MetaList({ metas, setter, filteredCategory, groups }: MetaListProps) {
  const [openEntityId, setOpenEntityId] = useState<number | null>(null)
  const toggleEntity = (id: number) => {
    setOpenEntityId(prev => (prev === id ? null : id))
  }


  const [metaToEdit, setMetaToEdit] = useState<metaType | null>(null)
  // const [metaToAdd, setMetaToAdd] = useState<metaType | null>(null)
  const [metaToAdd, setMetaToAdd] = useState<[metaType | null, string]>([null, ""])

  const token = localStorage.getItem("token");
  const role = getUserRole()
  const vistaActual = useLocation().pathname;
  const canEdit = vistaActual !== "/" && vistaActual !== "/search" && role === "admin";
  const canAddMeta = (vistaActual === "/" || vistaActual === "/search") && token


  //Si alguna de les condicions es true, es guarda la meta a la variable
  const filteredMetas = metas.filter(meta =>
  (!filteredCategory || meta.category_id === filteredCategory) &&
  meta.is_public &&
  (
    !meta.indexedMetas ||
    meta.indexedMetas.length === 0 ||
    meta.indexedMetas.some(im => im.is_community_approved === true)
  )
)


  return (
    <>


      <div className="metaList mt-4">
        <div className="titolComponent  text-center my-2">Llista de metas</div>
        <hr className="m-0" />

        <div className="inline">
          <ul className=" ps-2  m-0  py-2">
            {filteredMetas.map((meta) => (
              <li key={meta.id} className="m-0 p-0" >
                <div className={`metaEntry mt-1 me-3 ps-2 ${openEntityId === meta.id ? "mb-0" : "mb-1"} ${meta.type === "task" ? "meta-task" : "meta-challenge"}`}
                  onClick={() => toggleEntity(meta.id)}>

                  <div className="d-flex py-1 ps-2 pe-3 align-items-center">
                    <div>{meta.title}</div>

                    {canEdit &&
                      <button className="  btn btn-warning p-1  me-2  ms-auto"
                        onClick={(event) => {
                          event.stopPropagation()
                          setMetaToEdit(meta)
                        }}>Edita</button>
                    }
                    {canEdit &&
                      <button className="  btn btn-danger p-1   "
                        onClick={async (event) => {
                          event.stopPropagation()
                          await deleteMeta(meta.id)
                          setter(prev => prev.filter(prevMeta => prevMeta.id !== meta.id))
                        }}>X</button>
                    }
                  </div>
                </div>
                <div className=" metaDetailsBox  my-0 me-3">
                  {openEntityId === meta.id && (
                    <div className="metaDetails ps-2 py-2">
                      {vistaActual !== "/" &&
                        <>
                          <div>ID: {meta.id}</div>
                        </>
                      }
                      <div>Tipus: {meta.type}</div>
                      <div>Descripcio: {meta.description}</div>
                      <div>Categoria: {meta.category.name}</div>
                      <div>Autor: {meta.author.username}</div>
                      <div className="d-flex mt-2 justify-content-end">
                        {canAddMeta && meta.type === "task" &&
                          <>
                            <div className="">
                              <button className="  btn btn-primary p-1  me-2  ms-auto"
                                onClick={() => {
                                  setMetaToAdd([meta, "autoassign"]);
                                }}>Afegir a la meva llista</button>
                            </div>
                          </>
                        }
                        {canAddMeta &&
                          <>
                            <div className="">
                              <button className="  btn btn-primary p-1  me-2  ms-auto"
                                onClick={() => {
                                  setMetaToAdd([meta, "assign"]);
                                }}>{/* {meta.type === "task" ? "Assigna a membre de grup" : "Assigna a un grup"} */}Assigna a un grup </button>
                            </div>
                          </>
                        }
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
      {/* modal editar */}
      {metaToEdit && (
        <ModalEditMeta meta={metaToEdit} setEditMeta={setMetaToEdit} setter={setter} />
      )}
      {/* modal afegir meta a grup */}
      {metaToAdd[0] && (
        <ModalAddMeta meta={metaToAdd} setMetaToAdd={setMetaToAdd} groups={groups} />
      )}
    </>
  );
}