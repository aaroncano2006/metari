import { useState, useEffect } from "react"
import { fetchIndexedMetas, updateIndexedMeta } from "../services/IndexerService"
import type { indexedType } from "../types/indexedType"

type PendingIndexedMetasProps = {
  indexedMetas: indexedType[]
  setIndexedMetas: React.Dispatch<React.SetStateAction<indexedType[]>>
}


export function PendingIndexedMetas({ indexedMetas, setIndexedMetas }: PendingIndexedMetasProps) {
  const [openEntityId, setOpenEntityId] = useState<number | null>(null)
  const toggleEntity = (id: number) => {
    setOpenEntityId(prev => (prev === id ? null : id))
  }
  const pendingMetas = indexedMetas.filter(
    indexed => indexed.is_community_approved === null || indexed.is_community_approved === false
  )


  return (
    <div className="metaList mt-4">
      <div className="titolComponent text-center my-2">Metes pendents d'indexar</div>
      <hr className="m-0" />
      <div className="inline">
        <ul className="ps-2 m-0 py-2">
          {pendingMetas.length === 0 && (
            <li className="text-center text-muted py-3">No hi ha metes pendents</li>
          )}
          {pendingMetas.map((indexed) => (
            <li key={indexed.id} className="m-0 p-0">
              <div
                className={`metaEntry mt-1 me-3 ps-2 ${openEntityId === indexed.id ? "mb-0" : "mb-1"} ${indexed.meta.type === "task" ? "meta-task" : "meta-challenge"
                  }`}
                onClick={() => toggleEntity(indexed.id)}
              >
                <div className="d-flex py-1 ps-2 pe-3 align-items-center">
                  <div>{indexed.meta.title}</div>
                  {indexed.is_community_approved === null && (
                    <button className="btn btn-success btn-sm ms-2"
                      onClick={async (e) => {
                        e.stopPropagation()
                        await updateIndexedMeta(indexed.id, { is_community_approved: true })
                        setIndexedMetas(prev => prev.filter(im => im.id !== indexed.id))
                      }}
                    >
                      Aprovar
                    </button>
                  )}
                  <span className={`ms-auto badge ${indexed.is_community_approved === false ? "bg-danger" : "bg-warning text-black"}`}>
                    {indexed.is_community_approved === false ? "Rebutjada" : "Pendent"}
                  </span>
                </div>
              </div>
              <div className="metaDetailsBox my-0 me-3">
                {openEntityId === indexed.id && (
                  <div className="metaDetails ps-2 py-2">
                    <div>ID index: {indexed.id}</div>
                    <div>Tipus: {indexed.meta.type}</div>
                    <div>Descripció: {indexed.meta.description}</div>
                    <div>Categoria: {indexed.meta.category?.name}</div>
                    <div>Autor: {indexed.meta.author?.username}</div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}