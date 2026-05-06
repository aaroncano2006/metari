import type { userTypeFrontend } from "../types/userTypeFrontend"
import { useState } from "react"
import { ModalEditUser } from "./modals/ModalEditUser"
import { ModalEditGroup } from "./modals/ModalEditGroup";
import type { groupType } from "../types/groupType";
import { getUserRole } from "../services/auth/loginService"
import { useLocation } from "react-router-dom";



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
  const role = getUserRole()
  const vistaActual = useLocation().pathname;
  const canEdit = vistaActual !== "/" && role === "admin";
  return (
    <>

      <div className="metaList mt-4">
        <div className="titolComponent  text-center my-2">Llista de grups</div>
        <hr className="m-0" />

        <div className="inline">
          <ul className=" ps-2  m-0  py-2">
            {groups.map((group) => (
              <li key={group.id} className="m-0 p-0" >
                <div className={`metaEntry mt-1 me-3 ps-2 ${openEntityId === group.id ? "mb-0" : "mb-1"}`}
                  onClick={() => toggleEntity(group.id)}>

                  <div className="d-flex py-1 ps-2 pe-2 align-items-center">
                    {group.name}
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
                      <div>ID: {group.id}</div>
                      <div>Nom: {group.name}</div>
                      <div>Descripcio: {group.description}</div>
                      <div>owner_id: {group.owner_id}</div>
                      {/* <div>is_public: {group.is_public}</div> */}
                      <div>Public: {group.is_public ? "Sí" : "No"}</div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
      {/* modal editar */}
      {groupToEdit && (
        <ModalEditGroup group={groupToEdit} setEditGroup={setGroupToEdit} setter={setter} />
      )}
    </>
  )
}