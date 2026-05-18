import type { userTypeFrontend } from "../types/userTypeFrontend"
import { useState } from "react"
import { ModalEditUser } from "./modals/ModalEditUser"
import { ModalEditGroup } from "./modals/ModalEditGroup";
import type { groupType } from "../types/groupType";
import { getUserRole, getUserId } from "../services/auth/loginService"
import { Link, useLocation } from "react-router-dom";
import { fetchGroupById } from "../services/groupService";



type MyGroupListProps = {
  groups: groupType[]
}


export function MyGroupsList({ groups }: MyGroupListProps) {
  const [openEntityId, setOpenEntityId] = useState<number | null>(null)
  const toggleEntity = (id: number) => {
    setOpenEntityId(prev => (prev === id ? null : id))
  }

  const token = localStorage.getItem("token");


  //suma el total de punts del grup
  const groupScores = new Map(
    groups.map(group => [group.id, group.groupUsers.reduce((sum, groupUser) => sum + groupUser.user.score, 0)])
  )


  return (
    <>
      {token &&
        <div className="metaList mt-4">
          <div className="titolComponent  text-center my-2">Els meus grups</div>
          <hr className="m-0" />

          <div className="inline">
            {token &&
              <ul className=" ps-2  m-0  py-2">
                {groups.map((group) => (
                  <li key={group.id} className="m-0 p-0" >
                    <div className={`metaEntry mt-1 me-3 ps-2 ${openEntityId === group.id ? "mb-0" : "mb-1"}`}
                      onClick={() => toggleEntity(group.id)}>

                      <div className="d-flex py-1 ps-2 pe-2 align-items-center">
                        <div>{group.name}</div>

                      </div>
                    </div>
                    <div className=" metaDetailsBox  my-0 me-3">
                      {openEntityId === group.id && (
                        <div className="metaDetails ps-2 py-2">
                          <div>Nom: {group.name}</div>
                          <div>Puntuacio del grup: {groupScores.get(group.id)}</div>
                          <div>Descripcio: {group.description}</div>
                          <div>Creador: {group.owner.username}</div>
                          <div>Public: {group.is_public ? "Sí" : "No"}</div>
                          <div className="llistaUsuaris">
                            <div className="fw-bold mb-1">Membres del grup:</div>
                            {group.groupUsers.map((groupUser) => (
                              <div key={groupUser.user_id} className="d-flex  mb-1">
                                <div className="me-2">
                                  {groupUser.user.username}
                                </div>
                                {groupUser.role === "moderator" && (
                                  <div className="badge bg-warning text-black">
                                    <i className="bi bi-star-fill text-black"></i>
                                  </div>
                                )}
                                {/* <div className="badge bg-warning text-black">
                                {groupUser.role}
                              </div> */}
                              </div>
                            ))}
                          </div>
                          {/* } */}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            }
            {!token &&
              <div className="text-center">
                Fes <Link to="/profile" className=" p-1 ">
                  LogIn
                </Link>
                o <Link to="/register" className=" p-1 ">
                  Registra't
                </Link>
                per participar amb la comunitat
              </div>
            }
          </div>

        </div>
      }
    </>
  )
}