import type { metaType } from "../types/metaType";
import { useState, useEffect } from "react"
import { getUserRole, getUserId } from "../services/auth/loginService"
import { useLocation } from "react-router-dom";
import type { assignationType } from "../types/assignationType";
import type { groupType } from "../types/groupType";
import { ModalAddComment } from "./modals/ModalAddComment";
import { fetchComments } from "../services/commentService";
import type { commentType } from "../types/commentType";


type MyMetaListProps = {
  assignations: assignationType[]
  groups: groupType[]

}

export function MyMetaListByGroup({ assignations, groups }: MyMetaListProps) {
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
  const [showCompletedByGroup, setShowCompletedByGroup] = useState<Record<number, boolean>>({})
  const [assignationToAddComment, setAssignationToAddComment] = useState<assignationType | null>(null)

  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<commentType[]>([])

  useEffect(() => {
    const loadComments = async () => {
      const data = await fetchComments()
      setComments(data)
    }
    loadComments()
  }, [])


  //filtrar grups del usuari owner i membre
  const myGroups = groups.filter(group =>
    group.owner_id === loggedInUserId ||
    group.groupUsers.some(gu => gu.user_id === loggedInUserId)
  )

  const assignationsByGroup = myGroups.map(group => ({
    group,
    assignations: assignations.filter(a => a.group_id === group.id)
  }))
  // .filter(item => item.assignations.length > 0)


  return (
    <>
      {token &&
        <>
          {assignationsByGroup.map(({ group, assignations }) => (
            <div className="metaList mt-4" key={group.id}>
              <div className="d-flex align-items-center my-2 ps-4 pe-4 position-relative">
                <div className="titolComponent">
                  Metes del grup: {group.name}
                </div>
              </div>
              <hr className="m-0" />
              <div className="inline">
                <div className="d-flex ps-3 pe-3 mt-2">
                  <div className=" d-flex w-100">
                    <div className="me-auto">Les meves metes</div>
                    <label htmlFor={`showCompleted-${group.id}`} className="me-2">Mostrar completades</label>
                    <input type="checkbox" id={`showCompleted-${group.id}`}
                      checked={showCompletedByGroup[group.id] ?? false}
                      onChange={(e) => setShowCompletedByGroup(prev => ({ ...prev, [group.id]: e.target.checked }))}
                    />
                  </div>
                </div>
                <ul className="ps-2 m-0 py-2">
                  {assignations
                    //filtrem per les del usuari i challenges
                    .filter(assignation => assignation.user_id === loggedInUserId || assignation.meta.type === "challenge")
                    //filtrem si amaguem les completades
                    .filter(assignation => showCompletedByGroup[group.id] || !Boolean(assignation.completed))
                    .map((assignation) => (
                      <li key={assignation.meta.id} className="m-0 p-0">
                        <div className={`metaEntry mt-1 me-3 ps-2 ${openEntityId === assignation.id ? "mb-0" : "mb-1"} ${assignation.meta.type === "task" ? "meta-task" : "meta-challenge"}`}
                          onClick={() => toggleEntity(assignation.id)}>
                          <div className="d-flex py-1 ps-2 pe-3 align-items-center">
                            <div className="me-auto">{assignation.meta.title}</div>
                            <div className="me-2">{assignation.completed === true ? "completada" : ""}</div>

                          </div>
                        </div>
                        <div className="metaDetailsBox my-0 me-3 ">
                          {openEntityId === assignation.id && (

                            <div className="metaDetails ps-2 py-2 d-flex flex-column">
                              <div>📌 Tipus:{assignation.meta.type}</div>
                              <div>📝 Descripció: {assignation.meta.description}</div>
                              {assignation.user_id &&
                                <div>👤 Assignada a: {assignation.user?.name ?? assignation.user_id}</div>
                              }
                              <div>📅 Inici: {assignation.start_date?.split("T")[0]}</div>
                              <div>⏳ Data límit: {assignation.due_date?.split("T")[0]}</div>
                              <div>🔥 Prioritat: {assignation.priority}</div>
                              <div>✔️ Estat: {assignation.completed ? "completada" : "pendent"}</div>
                              <div>🆕 Creat: {assignation.created_at?.split("T")[0]}</div>
                              <div>🔄 Actualitzat: {assignation.updated_at?.split("T")[0]}</div>
                              <div className=" d-flex align-self-end me-2 mb-2 mt-2">

                                <div className="btn btn-primary d-flex align-self-end me-2 "
                                  onClick={() => {
                                    // setShowComments(true);
                                    setShowComments(prev => !prev);
                                    //canviar variable al contrari del prev
                                  }}>Mostrar comentaris</div>
                                <div className="btn btn-primary align-self-end me-2 "
                                  onClick={() => {
                                    setAssignationToAddComment(assignation);
                                  }}>Nou comentari</div>
                              </div>


                              {showComments === true && (() => {
                                const filteredComments = comments
                                  .filter(c => c.assignation_id === assignation.id)
                                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                return filteredComments.length > 0
                                  ? filteredComments.map(comment => (
                                    <>
                                      <div key={comment.id} className="border rounded p-2 mb-1 bg-white me-2">
                                        {comment.user?.name ?? comment.user_id}:
                                        <p className="mb-0">{comment.body}</p>
                                        <small>{new Date(comment.created_at).toLocaleString("ca-ES")}</small>
                                        <div className=" d-flex justify-content-end">

                                          {comment.user_id === getUserId() &&


                                            <div className="btn btn-warning align-self-end me-2 "
                                              onClick={() => {
                                                //edit
                                              }}>edita</div>

                                          }
                                          {(comment.user_id === getUserId() || group.owner_id === getUserId()) &&
                                            <div className="btn btn-danger align-self-end me-2 "
                                              onClick={() => {
                                                //edit
                                              }}>Elimina</div>
                                          }
                                        </div>
                                      </div>

                                    </>
                                  ))
                                  : <p className="text-muted">No hi ha comentaris</p>
                              })()}
                            </div>

                          )}
                        </div>
                      </li>
                    ))}
                </ul>


                <div className="me-auto ms-3">Metes dels integrants del grup</div>
                <ul className="ps-2 m-0 py-2">
                  {assignations
                    .filter(a => (a.user_id !== loggedInUserId && a.meta.type === "task"))
                    .filter(assignation => showCompletedByGroup[group.id] || !Boolean(assignation.completed))
                    .map((assignation) => (
                      <li key={assignation.meta.id} className="m-0 p-0">
                        <div className={`metaEntry mt-1 me-3 ps-2 ${openEntityId === assignation.id ? "mb-0" : "mb-1"} ${assignation.meta.type === "task" ? "meta-task" : "meta-challenge"}`}
                          onClick={() => toggleEntity(assignation.id)}>
                          <div className="d-flex py-1 ps-2 pe-3 align-items-center">
                            <div className="me-auto">{assignation.meta.title}</div>
                            <div className="">{assignation.completed === true ? "completada" : ""}</div>
                          </div>
                        </div>
                        <div className="metaDetailsBox my-0 me-3">
                          {openEntityId === assignation.id && (
                            <div className="metaDetails ps-2 py-2">
                              <div>📌 Tipus:{assignation.meta.type}</div>
                              <div>📝 Descripció: {assignation.meta.description}</div>
                              {assignation.user_id &&
                                <div>👤 Assignada a: {assignation.user?.name ?? assignation.user_id}</div>
                              }
                              <div>📅 Inici: {assignation.start_date?.split("T")[0]}</div>
                              <div>⏳ Data límit: {assignation.due_date?.split("T")[0]}</div>
                              <div>🔥 Prioritat: {assignation.priority}</div>
                              <div>✔️ Estat: {assignation.completed ? "completada" : "pendent"}</div>
                              <div>🆕 Creat: {assignation.created_at?.split("T")[0]}</div>
                              <div>🔄 Actualitzat: {assignation.updated_at?.split("T")[0]}</div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ))}
        </>
      }
      {assignationToAddComment && (
        <ModalAddComment
          assignation={assignationToAddComment}
          assignationSetter={setAssignationToAddComment}
          commentsSetter={setComments}
        />
      )}
    </>
  );
}



// afegir un boto per mostrar comentaris i que es mostrin per ordre descendent per data de creacio, amb el nom del usuari del comentari