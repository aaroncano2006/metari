import type { metaType } from "../types/metaType";
import { useState } from "react"
import { getUserRole, getUserId } from "../services/auth/loginService"
import { useLocation } from "react-router-dom";
import type { assignationType } from "../types/assignationType";
import { updateAssignation } from "../services/assignationService"


type MyMetaListProps = {
  assignations: assignationType[]
  setAssignations: React.Dispatch<React.SetStateAction<assignationType[]>>

}

export function MyMetaList({ assignations, setAssignations }: MyMetaListProps) {
  const [openEntityId, setOpenEntityId] = useState<number | null>(null)
  const toggleEntity = (id: number) => {
    setOpenEntityId(prev => (prev === id ? null : id))
  }


  const token = localStorage.getItem("token");
  const role = getUserRole()
  const vistaActual = useLocation().pathname;
  // const canEdit = vistaActual !== "/" && role === "admin";
  const loggedInUserId = getUserId()
  const [showCompleted, setShowCompleted] = useState(false)


  const myAssignations = assignations.filter(assignation => assignation.user_id === loggedInUserId)




  return (
    <>
      {token &&

        <div className="metaList mt-4">
          <div className="my-2 ps-4 pe-4">
            <div className="titolComponent text-center ">
              Les meves metas
            </div>
          </div>
          <hr className="m-0" />

          <div className="inline">
            <div className="d-flex ps-3 pe-3 mt-2">
              <div className="me-auto">Metes personals</div>
              <div className="ms-auto d-flex align-items-center">
                <label htmlFor="showCompleted" className="me-2">Mostrar completades</label>
                <input type="checkbox" id="showCompleted"
                  checked={showCompleted}
                  onChange={(e) => setShowCompleted(e.target.checked)}
                />
              </div>
            </div>
            <ul className=" ps-2  m-0  py-2">
              {myAssignations
                .filter(assignation => showCompleted || !Boolean(assignation.completed))
                .map((assignation) => (
                  <li key={assignation.id} className="m-0 p-0" >
                    <div className={`metaEntry mt-1 me-3 ps-2 ${openEntityId === assignation.id ? "mb-0" : "mb-1"} ${assignation.meta.type === "task" ? "meta-task" : "meta-challenge"}`}
                      onClick={() => toggleEntity(assignation.id)}>

                      <div className="d-flex py-1 ps-2 pe-3 align-items-center">
                        <div className="me-auto">{assignation.meta.title}</div>
                        {assignation.completed === true && (
                              <div className="badge bg-success">completada</div>
                            )}
                      </div>

                    </div>
                    <div className=" metaDetailsBox  my-0 me-3">
                      {openEntityId === assignation.id && (
                        <div className="metaDetails ps-2 py-2">
                          <div>📌 Tipus: {assignation.meta.type}</div>
                          <div>📝 Descripció: {assignation.meta.description}</div>
                          {assignation.user_id && (
                            <div>
                              👤 Assignada a:{" "}
                              {assignation.user?.name
                                ? `${assignation.user?.name} (${assignation.user?.username})`
                                : assignation.user_id}
                            </div>
                          )}
                          {assignation.assigner_id && (
                            <div>
                              👑 Assignada per:{" "}
                              {assignation.assigner?.name
                                ? `${assignation.assigner?.name} (${assignation.assigner?.username})`
                                : assignation.assigner_id}
                            </div>
                          )}
                          <div>📅 Inici: {assignation.start_date?.split("T")[0].split("-").reverse().join("-")}</div>
                          <div>⏳ Data límit: {assignation.due_date?.split("T")[0].split("-").reverse().join("-") ?? "sense data limit"}</div>
                          <div>🔥 Prioritat: {assignation.priority ?? "sense prioritat"}</div>
                          <div>🔥 Dificultat: {assignation.difficulty}</div>

                          {assignation.meta.type === "challenge" && (
                            <div>🏆 Puntuacio: {assignation.score ?? 0}</div>
                          )}

                          {assignation.assignationCompletions && assignation.assignationCompletions.length > 0 && (
                            <div>✅ Completat per: {assignation.assignationCompletions
                              .filter(ac => ac.is_Completed)
                              .map(ac => ac.user?.username ?? ac.user_id)
                              .join(", ")
                            }</div>
                          )}

                          {assignation.needs_proofs !== null && assignation.needs_proofs !== undefined && (
                            <div>📋 Requereix proves: {assignation.needs_proofs ? "Sí" : "No"}</div>
                          )}

                          <div>🆕 Creat el dia: {assignation.created_at && assignation.created_at.split("T")[0].split("-").reverse().join("-") + " a les " + assignation.created_at.split("T")[1].split(".")[0]}</div>
                          <div>🔄 Actualitzat el dia: {assignation.updated_at && assignation.updated_at.split("T")[0].split("-").reverse().join("-") + " a les " + assignation.updated_at.split("T")[1].split(".")[0]}</div>

                          {!assignation.completed && assignation.meta.type === "task" && !assignation.needs_proofs && (
                            <div className="btn btn-success mt-2"
                              onClick={async () => {
                                await updateAssignation(assignation.id, { completed: true })
                                setAssignations(prev => prev.map(a =>
                                  a.id === assignation.id ? { ...a, completed: true } : a
                                ))
                              }}>
                              Marcar completada
                            </div>
                          )}

                        </div>
                      )}
                    </div>
                  </li>
                ))}
            </ul>

          </div>

        </div>
      }
    </>
  );
}