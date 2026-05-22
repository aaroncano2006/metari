import type { metaType } from "../types/metaType";
import { useState } from "react"
import { ModalEditMeta } from "./modals/ModalEditMeta";
type UserCreatedMetasProps = {
  metas: metaType[]
  setter: React.Dispatch<React.SetStateAction<metaType[]>>
}
export function UserCreatedMetas({ metas, setter }: UserCreatedMetasProps) {
  const [openEntityId, setOpenEntityId] = useState<number | null>(null)
  const [metaToEdit, setMetaToEdit] = useState<metaType | null>(null)
  const toggleEntity = (id: number) => {
    setOpenEntityId(prev => (prev === id ? null : id))
  }

  const getStatusBadge = (meta: metaType) => {
    if (!meta.indexedMetas || meta.indexedMetas.length === 0) {
      return <span className="badge bg-secondary">Sense indexar</span>
    }
    const status = meta.indexedMetas[0].is_community_approved
    if (status === true) {
      return <span className="badge bg-success">Aprovada</span>
    } else if (status === false) {
      return <span className="badge bg-danger">Rebutjada</span>
    } else {
      return <span className="badge bg-warning text-black">Pendent</span>
    }
  }
  const isPending = (meta: metaType) => {
    return meta.indexedMetas && meta.indexedMetas.length > 0 && meta.indexedMetas[0].is_community_approved === null
  }
  return (
    <div className="metaList">
      <div className="titolComponent text-center my-2 "><i className=" text-danger me-2 bi bi-bullseye"></i>Metas creades</div>
      {/* <hr className="m-0" /> */}
      <div className="inline">
        {metas.length === 0 && (
          <div className="text-center text-muted py-3">No ha creat cap meta</div>
        )}
        <ul className="ps-3 m-0 pb-2">
          {metas.map((meta) => (
            <li key={meta.id} className="m-0 p-0">
              <div
                className={`metaEntry mt-1 me-3 ps-2 ${openEntityId === meta.id ? "mb-0" : "mb-1"} ${meta.type === "task" ? "meta-task" : "meta-challenge"}`}
                onClick={() => toggleEntity(meta.id)}
              >
                <div className="d-flex py-1 ps-2 pe-3 align-items-center">
                  <div className="me-auto">{meta.title}</div>
                  {getStatusBadge(meta)}
                </div>
              </div>
              <div className="metaDetailsBox my-0 me-3">
                {openEntityId === meta.id && (
                  <div className="metaDetails ps-2 py-2">
                    <div>Tipus: {meta.type}</div>
                    <div>Descripció: {meta.description}</div>
                    <div>Categoria: {meta.category?.name}</div>
                    <div>Pública: {meta.is_public ? "Sí" : "No"}</div>
                    {/*  editar metes pendents (si hi ha temps. s'aurien de modificar les assignacions corresponents a la meta) */}
                    {/* {isPending(meta) && (
                      <div className="d-flex mt-2 justify-content-end">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setMetaToEdit(meta)
                          }}
                        >
                          Edita
                        </button>
                      </div>
                    )} */}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      {metaToEdit && (
        <ModalEditMeta meta={metaToEdit} setEditMeta={setMetaToEdit} setter={setter} />
      )}
    </div>
  )
}