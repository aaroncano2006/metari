import type { userTypeFrontend } from "../types/userTypeFrontend"
import { useState } from "react"
import { ModalEditUser } from "./modals/ModalEditUser"
import { getUserRole } from "../services/auth/loginService"
import { Link, useLocation } from "react-router-dom";


type UserListProps = {
  users: userTypeFrontend[]
  setter: React.Dispatch<React.SetStateAction<userTypeFrontend[]>>

}

export function UserList({ users, setter }: UserListProps) {

  const [openEntityId, setOpenEntityId] = useState<number | null>(null)
  const toggleEntity = (id: number) => {
    setOpenEntityId(prev => (prev === id ? null : id))
  }


  const [userToEdit, setUserToEdit] = useState<userTypeFrontend | null>(null)
  const token = localStorage.getItem("token");
  const role = getUserRole()
  const vistaActual = useLocation().pathname;
  const canEdit =
    (vistaActual !== "/" && vistaActual !== "/myGroups" && vistaActual !== "/myMetas") &&
    role === "admin";

  const top10 = [...users].sort((a, b) => b.score - a.score).slice(0, 10)
  let usersToShow = top10;
  if (vistaActual === "/") {
    usersToShow = top10;
  } else {
    usersToShow = users;
  }

  return (
    <>

      <div className="metaList mt-4">
        <div className="titolComponent  text-center my-2">{vistaActual === "/Admin" ? "Llista d'usuaris" : "Top 10 Usuaris"}</div>
        <hr className="m-0" />

        <div className="inline">
          {token &&
            <ul className=" ps-2  m-0  py-2">
              {usersToShow.map((user) => (
                <li key={user.id} className="m-0 p-0" >
                  <div className={`metaEntry mt-1 me-3 ps-2 ${openEntityId === user.id ? "mb-0" : "mb-1"}`}
                    onClick={() => toggleEntity(user.id)}>



                    <div className="d-flex py-1 ps-2 pe-2  align-items-center">
                      <div className="me-auto">{user.username}</div>
                      {token &&
                        <Link to={`/Profile?username=${user.username}`} className="btn btn-primary p-1 ">
                          <i className="bi bi-person-fill"></i>
                        </Link>
                      }

                      {canEdit &&
                        <button className="  btn btn-warning p-1 ms-2 me-2 "
                          onClick={(event) => {
                            event.stopPropagation()
                            setUserToEdit(user)
                          }}>Edita</button>
                      }
                      {canEdit &&
                        <button className="  btn btn-danger p-1   "
                          onClick={async (event) => {
                            event.stopPropagation()
                            // await deleteUser(user.id)
                          }}>X</button>
                      }

                    </div>
                  </div>
                  <div className=" metaDetailsBox  my-0 me-3">
                    {openEntityId === user.id && (
                      <div className="metaDetails ps-2 py-2">
                        {vistaActual === "/Admin" &&
                          <>
                            <div>ID: {user.id}</div>
                            <div>Nom: {user.name}</div>
                            <div>e-mail: {user.email}</div>
                            <div>Rol: {user.role}</div>
                          </>
                        }

                        <div>completed_tasks: {user.completed_tasks}</div>
                        <div>Puntuacio: {user.score}</div>

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
      {userToEdit && (
        <ModalEditUser user={userToEdit} setEditUser={setUserToEdit} setter={setter} />
      )}
    </>
  )
}