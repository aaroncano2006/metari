import type { userTypeFrontend } from "../types/userTypeFrontend"
import { useState } from "react"
import { ModalEditUser } from "./modals/ModalEditUser"


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
  return (
    <>

      <div className="metaList ">
              <div className="titolComponent  text-center my-2">Llista d'usuaris</div>
              <hr className="m-0" />
      
              <div className="inline">
                <ul className=" ps-4  m-0  py-2">
                  {users.map((user) => (
                    <li key={user.id} className="m-0 p-0" >
                      <div className={`metaEntry mt-1 me-3 ps-2 ${openEntityId === user.id ? "mb-0" : "mb-1"}`}
                        onClick={() => toggleEntity(user.id)}>
      
                        <div className="d-flex py-1 ps-2 pe-3 align-items-center">
                          {user.username}
                          <button className="  btn btn-warning p-1  me-2  ms-auto"
                            onClick={(event) => {
                              event.stopPropagation()
                              setUserToEdit(user)
                            }}>Edita</button>
                          <button className="  btn btn-danger p-1   "
                            onClick={async (event) => {
                              event.stopPropagation()
                              // await deleteUser(user.id)
                            }}>X</button>
                        </div>
                      </div>
                      <div className=" metaDetailsBox  my-0 me-3">
                        {openEntityId === user.id && (
                          <div className="metaDetails ps-2 py-2">
                            <div>ID: {user.id}</div>
                            <div>Nom: {user.name}</div>
                            <div>e-mail: {user.email}</div>
                            <div>Rol: {user.role}</div>
                            <div>completed_tasks: {user.completed_tasks}</div>
                            <div>Puntuacio: {user.score}</div>
                            <div>Rol: {user.role}</div>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
      
            </div>
            {/* modal editar */}
                  {userToEdit && (
                    <ModalEditUser user={userToEdit} setEditUser={setUserToEdit} setter={setter} />
                  )}
    </>
  )
}