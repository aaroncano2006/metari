import type { metaType } from "../types/metaType";
import { useState } from "react"


import { deleteMeta } from "../services/metaService";


type MetaListProps = {
  metas: metaType[]
}

export function MetaList({ metas }: MetaListProps) {
  const [openEntityId, setOpenEntityId] = useState<number | null>(null)
  const toggleEntity = (id: number) => {
    setOpenEntityId(prev => (prev === id ? null : id))
  }
  return (
    <>


      <div className="metaList ">
        <div className="titolComponent  text-center my-2">Llista de metas</div>
        <hr className="m-0" />

        <div className="inline">
          <ul className=" ps-4  m-0  py-2">
            {metas.map((meta) => (
              <li key={meta.id} className="m-0 p-0" >
                <div className={`metaEntry mt-1 me-3 ps-2 ${openEntityId === meta.id ? "mb-0" : "mb-1"} ${meta.type === "task" ? "meta-task" : "meta-challenge"}`}
                  onClick={() => toggleEntity(meta.id)}>

                  <div className="d-flex py-1 ps-2 pe-3 align-items-center">
                    {meta.title}
                    <button className="  btn btn-warning p-1  me-2  ms-auto"
                      onClick={(event) => {
                        event.stopPropagation()
                      }}>Edita</button>
                    <button className="  btn btn-danger p-1   "
                      onClick={ async (event) => {
                        event.stopPropagation()
                         await deleteMeta(meta.id)
                      }}>X</button>
                  </div>
                </div>
                <div className=" metaDetailsBox  my-0 me-3">
                  {openEntityId === meta.id && (
                    <div className="metaDetails ps-2 py-2">
                      {/* Replace with real fields */}
                      <div>ID: {meta.id}</div>
                      <div>Tipus: {meta.type}</div>
                      <div>Descripcio: {meta.description}</div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </>
  );
}