import { useState, useEffect } from "react"
import { deleteIndexedMeta, fetchIndexedMetas, updateIndexedMeta } from "../services/IndexerService"
import type { indexedType } from "../types/indexedType"
import { deleteMeta } from "../services/metaService"
import { deleteAssignation, fetchAssignations } from "../services/assignationService"

type PendingIndexedMetasProps = {
  indexedMetas: indexedType[];
  setIndexedMetas: React.Dispatch<React.SetStateAction<indexedType[]>>;
  isGroupModerating?: boolean;
};

export function PendingIndexedMetas({
  indexedMetas,
  setIndexedMetas,
  isGroupModerating,
}: PendingIndexedMetasProps) {
  const [openEntityId, setOpenEntityId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<"pending" | "rejected">(
    "pending",
  );

  const toggleEntity = (id: number) => {
    setOpenEntityId((prev) => (prev === id ? null : id));
  };
  const pendingMetas = indexedMetas.filter((indexed) =>
    isGroupModerating
      ? filterStatus === "pending"
        ? indexed.is_approved === null
        : indexed.is_approved === false
      : filterStatus === "pending"
        ? indexed.is_community_approved === null
        : indexed.is_community_approved === false,
  );

  return (
    <div className="metaList mt-4">
      <div className="titolComponent text-center my-2">Metes a indexar</div>
      <hr className="m-0" />
      <div className="inline">
        <div className="d-flex justify-content-center gap-3 my-2">
          <label>
            <input
              type="radio"
              name="filter"
              value="pending"
              checked={filterStatus === "pending"}
              onChange={() => setFilterStatus("pending")}
            />{" "}
            Pendents
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="rejected"
              checked={filterStatus === "rejected"}
              onChange={() => setFilterStatus("rejected")}
            />{" "}
            Rebutjades
          </label>
        </div>

        <ul className="ps-2 m-0 py-2">
          {pendingMetas.length === 0 && (
            <li className="text-center text-muted py-3">
              No hi ha metes pendents
            </li>
          )}
          {pendingMetas.map((indexed) => (
              <li key={indexed.id} className="m-0 p-0">
                <div
                  className={`metaEntry mt-1 me-3 ps-2 ${openEntityId === indexed.id ? "mb-0" : "mb-1"} ${
                    indexed.meta.type === "task" ? "meta-task" : "meta-challenge"
                  }`}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleEntity(indexed.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleEntity(indexed.id);
                    }
                  }}
                >
                <div className="d-flex py-1 ps-2 pe-3 align-items-center">
                  <div>{indexed.meta.title}</div>

                  <span
                    className={`ms-auto badge ${isGroupModerating ? (indexed.is_approved === false ? "bg-danger" : "bg-warning text-black") : indexed.is_community_approved === false ? "bg-danger" : "bg-warning text-black"}`}
                  >
                    {isGroupModerating
                      ? indexed.is_approved === false
                        ? "Rebutjada"
                        : "Pendent"
                      : indexed.is_community_approved === false
                        ? "Rebutjada"
                        : "Pendent"}
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
                    <button className="btn btn-success btn-sm ms-2"
                      title="Aprovar indexació"
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const data = isGroupModerating
                            ? { is_approved: true }
                            : { is_community_approved: true };
                          await updateIndexedMeta(indexed.id, data);
                          setIndexedMetas((prev) =>
                            prev.filter((im) => im.id !== indexed.id),
                          );
                        } catch {
                          console.error("Error approving indexed meta");
                        }
                      }}
                    > Aprovar
                    </button>
                    
                    <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const data = isGroupModerating
                            ? { is_approved: false }
                            : { is_community_approved: false };
                          await updateIndexedMeta(indexed.id, data);
                          setIndexedMetas((prev) =>
                            prev.map((im) =>
                              im.id === indexed.id ? { ...im, ...data } : im,
                            ),
                          );
                        } catch {
                          console.error("Error rejecting indexed meta");
                        }
                      }}
                    >
                      Rebutjar
                    </button>
                    
                    {indexed.is_community_approved !== null &&
                      <button className="btn btn-warning btn-sm ms-2"
                      title="Marcar pendent"
                        onClick={async (e) => {
                          e.stopPropagation()
                          await updateIndexedMeta(indexed.id, { is_community_approved: null })
                          setIndexedMetas(prev => prev.map(im =>
                            im.id === indexed.id ? { ...im, is_community_approved: null } : im
                          ))
                        }}
                      >
                        Marcar pendent
                      </button>
                    }
                    
                    {/*{indexed.is_community_approved !== false &&
                      <button className="btn btn-danger btn-sm ms-2"
                        onClick={async (e) => {
                          e.stopPropagation()
                          await updateIndexedMeta(indexed.id, { is_community_approved: false })
                          setIndexedMetas(prev => prev.map(im =>
                            im.id === indexed.id ? { ...im, is_community_approved: false } : im
                          ))
                        }}
                      >
                        Rebutjar
                      </button>
                    }*/}

                    {indexed.is_community_approved === false &&
                      <button className="btn btn-danger btn-sm ms-2"
                        title="Eliminar meta"
                        onClick={async (e) => {
                          e.stopPropagation()
                          if (!confirm("Estàs segur que el vols eliminar?")) return;

                          const allAssignations = await fetchAssignations()
                          const toDelete = allAssignations.filter(a => a.meta_id === indexed.meta_id)
                          for (const ass of toDelete) {
                            await deleteAssignation(ass.id)
                          }

                          await deleteIndexedMeta(indexed.id)
                          await deleteMeta(indexed.meta_id)
                          setIndexedMetas(prev => prev.filter(im => im.id !== indexed.id))
                        }}
                      >
                        Eliminar
                      </button>
                    }
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
