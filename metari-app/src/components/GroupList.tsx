import type { userTypeFrontend } from "../types/userTypeFrontend"
import { useState } from "react"
import { ModalEditUser } from "./modals/ModalEditUser"
import { ModalEditGroup } from "./modals/ModalEditGroup";
import type { groupType } from "../types/groupType";
import { getUserRole } from "../services/auth/loginService"
import { Link, useLocation } from "react-router-dom";





type GroupListProps = {
  groups: groupType[]
  setter: React.Dispatch<React.SetStateAction<groupType[]>>

}


export function GroupList({ groups, setter }: GroupListProps) {

  const [openEntityId, setOpenEntityId] = useState<number | null>(null)
  const toggleEntity = (id: number) => {
    setOpenEntityId(prev => (prev === id ? null : id))
  }

  const [groupToEdit, setGroupToEdit] = useState<groupType | null>(null)
  const token = localStorage.getItem("token");
  const role = getUserRole()
  const vistaActual = useLocation().pathname;
  const canEdit =
    (vistaActual !== "/" && vistaActual !== "/myGroups" && vistaActual !== "/myMetas") &&
    role === "admin";

  //suma el total de punts del grup

  const visibleGroups = vistaActual === "/"
    ? groups.filter(g => g.is_public)
    : groups

  const groupScores = new Map(
    visibleGroups.map(group => [group.id, group.groupUsers.reduce((sum, groupUser) => sum + groupUser.user.score, 0)])
  )

  const top10 = [...visibleGroups].sort((a, b) => {
    const scoreA = a.groupUsers.reduce((sum, groupUser) => sum + groupUser.user.score, 0)
    const scoreB = b.groupUsers.reduce((sum, groupUser) => sum + groupUser.user.score, 0)
    return scoreB - scoreA
  }).slice(0, 10)


  const groupsToShow = vistaActual === "/" ? top10 : groups;

  return (
    <>

      <div className="metaList mt-4">
        <div className="titolComponent  text-center my-2">{vistaActual === "/Admin" ? "Llista de grups" : "Top 10 Grups"}</div>
        <hr className="m-0" />

        <div className="inline">
          {token &&
            <ul className=" ps-2  m-0  py-2">
              {groupsToShow.map((group) => (
                <li key={group.id} className="m-0 p-0" >
                  <div className={`metaEntry mt-1 me-3 ps-2 ${openEntityId === group.id ? "mb-0" : "mb-1"}`}
                    onClick={() => toggleEntity(group.id)}>

                    <div className="d-flex py-1 ps-2 pe-2 align-items-center">
                      <div>{group.name}</div>
                      {canEdit &&
                        <button className="  btn btn-warning p-1  me-2  ms-auto"
                          onClick={(event) => {
                            event.stopPropagation()
                            setGroupToEdit(group)
                          }}>Edita</button>
                      }
                      {canEdit &&
                        <button className="  btn btn-danger p-1   "
                          onClick={async (event) => {
                            event.stopPropagation()
                            // await deleteGroup(group.id)
                          }}>X</button>
                      }
                    </div>
                  </div>
                  <div className=" metaDetailsBox  my-0 me-3">
                    {openEntityId === group.id && (
                      <div className="metaDetails ps-2 py-2">
                        {vistaActual !== "/" &&
                          <>
                            <div>ID: {group.id}</div>
                            <div>Public: {group.is_public ? "Sí" : "No"}</div>
                          </>
                        }
                        <div>Nom: {group.name}</div>
                        <div>Puntuacio del grup: {groupScores.get(group.id)}</div>
                        <div>Descripcio: {group.description}</div>
                        {/* <div>owner_id: {group.owner_id}</div> */}
                        <div>Creador: {group.owner.username}</div>
                        {/* {vistaActual !== "/" && */}
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
              Fes <Link to="/login" className=" p-1 ">
                LogIn
              </Link>
              o <Link to="/Register" className=" p-1 ">
                Registra't
              </Link>
              per participar amb la comunitat
            </div>
          }
        </div>

      </div>
      {/* modal editar */}
      {groupToEdit && (
        <ModalEditGroup group={groupToEdit} setEditGroup={setGroupToEdit} setter={setter} />
      )}
    </>
  )
}