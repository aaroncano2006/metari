import { useState } from "react"
import { ModalEditGroup } from "./modals/ModalEditGroup";
import type { groupType } from "../types/groupType";
import { getUserId, getUserRole } from "../services/auth/loginService"
import { Link, useLocation } from "react-router-dom";
import SendGroupInvitationBtn from "./Buttons/SendGroupInvitationBtn";
import ModalGroupModeratorPanel from "./modals/ModalGroupModeratorPanel";
import { deleteGroup } from "../services/groupService";



type GroupListProps = {
  groups: groupType[]
  setter: React.Dispatch<React.SetStateAction<groupType[]>>
  isTop10?: boolean
}


export function GroupList({ groups, setter, isTop10 }: GroupListProps) {

  const [openEntityId, setOpenEntityId] = useState<number | null>(null)
  const toggleEntity = (id: number) => {
    setOpenEntityId(prev => (prev === id ? null : id))
  }

  const [groupToEdit, setGroupToEdit] = useState<groupType | null>(null)
  const [groupModeratorPanel, setGroupModeratorPanel] = useState<groupType | null>(null);
  const token = localStorage.getItem("token");
  const role = getUserRole()
  const vistaActual = useLocation().pathname;
  const canEdit =
    (vistaActual !== "/" && vistaActual !== "/search" && vistaActual !== "/mygroups" && vistaActual !== "/mymetas") &&
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


  let groupsToShow = top10;
  if (isTop10) {
    groupsToShow = top10;
  } else {
    groupsToShow = groups;
  }

  return (
    <>

      <div className="metaList mt-4">
        <div className="titolComponent text-center my-2">
          {vistaActual === "/admin" || !isTop10 ? (
            "Llista de grups"
          ) : (
            <>
              <i className="bi bi-trophy-fill me-2 text-primary"></i>
              Top 10 Grups
            </>
          )}
        </div>
        {/* <hr className="m-0" /> */}

        <div className="inline">
          {token &&
            <ul className=" ps-3  m-0  pb-2">
              {groupsToShow.map((group) => (
                <li key={group.id} className="m-0 p-0" >
                  <div className={`metaEntry mt-1 me-3 ps-2 ${openEntityId === group.id ? "mb-0" : "mb-1"}`}
                    onClick={() => toggleEntity(group.id)}>

                    <div className="d-flex ps-2 pe-2 align-items-center gap-2">
                      <i className="bi bi-people-fill me-3 profileIcon"></i>
                      <div className="me-auto">{group.name}</div>
                      {token && vistaActual !== "/admin" && (
                        <SendGroupInvitationBtn receiverId={getUserId()!} groupId={group.id} isPublic={group.is_public} small={true} />
                      )}
                      {token && vistaActual !== "/admin" && group.groupUsers.find((el) => el.group_id === group.id && el.user_id === getUserId() && el.role === "moderator") && (
                        <>
                          <button
                            className="btn btn-outline-primary p-1 smallButton"
                            onClick={() => setGroupModeratorPanel(group)}
                            title="Configuració i moderació del grup"
                          >
                            <i className="bi bi-gear-fill"></i>
                          </button>
                        </>
                      )}
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
                            event.stopPropagation();
                            try {
                              if (!confirm("Estàs segur que el vols eliminar?")) return;
                              await deleteGroup(group.id);
                              setter(prev => prev.filter(g => g.id !== group.id));
                              alert("Grup eliminat correctament");
                            } catch (error) {
                              alert("Error en eliminar el grup");
                            }
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
              o <Link to="/register" className=" p-1 ">
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
      {groupModeratorPanel && (
        <ModalGroupModeratorPanel
          group={groupModeratorPanel}
          setEditGroup={setGroupModeratorPanel}
          setter={setter}
        />
      )}
    </>
  )
}