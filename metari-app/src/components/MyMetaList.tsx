import type { metaType } from "../types/metaType";
import { useState } from "react"
import { getUserRole, getUserId } from "../services/auth/loginService"
import { useLocation } from "react-router-dom";
import type { assignationType } from "../types/assignationType";


type MyMetaListProps = {
  assignations: assignationType[]

}

export function MyMetaList({ assignations }: MyMetaListProps) {
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
          <div className="d-flex align-items-center my-2 ps-4 pe-4 position-relative">

            <div className="titolComponent position-absolute start-50 translate-middle-x">
              Les meves metas
            </div>

            <div className="ms-auto d-flex align-items-center">
              <label htmlFor="showCompleted" className="me-2">Mostrar completades</label>
              <input type="checkbox" id="showCompleted"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
              />
            </div>

          </div>
          <hr className="m-0" />

          <div className="inline">
            <div className="d-flex ps-3 pe-3 mt-2">
              <div className="me-auto">Metes individuals</div>

            </div>
            <ul className=" ps-2  m-0  py-2">
              {myAssignations
                .filter(assignation => showCompleted || !Boolean(assignation.completed))
                .map((assignation) => (
                  <li key={assignation.meta.id} className="m-0 p-0" >
                    <div className={`metaEntry mt-1 me-3 ps-2 ${openEntityId === assignation.id ? "mb-0" : "mb-1"} ${assignation.meta.type === "task" ? "meta-task" : "meta-challenge"}`}
                      onClick={() => toggleEntity(assignation.id)}>

                      <div className="d-flex py-1 ps-2 pe-3 align-items-center">
                        <div>{assignation.meta.title}</div>
                      </div>

                    </div>
                    <div className=" metaDetailsBox  my-0 me-3">
                      {openEntityId === assignation.id && (
                        <div className="metaDetails ps-2 py-2">
                          {/* <div>ID: {assignation.id}</div> */}
                          <div>Tipus: {assignation.meta.type}</div>
                          <div>Descripcio: {assignation.meta.description}</div>
                          <div>Comensar el: {assignation.start_date}</div>
                          <div>Acabar avans del: {assignation.due_date}</div>
                          <div>prioritat: {assignation.priority}</div>
                          <div>completada: {assignation.completed ? "si" : "no"}</div>
                          <div>Creada el: {assignation.created_at}</div>
                          <div>Actualitzada el: {assignation.updated_at}</div>


                        </div>
                      )}
                    </div>
                  </li>
                ))}
            </ul>
            <div className="d-flex ps-3 pe-3 mt-2">
              <div className="me-auto">Metes de grup</div>
              {/* <div className=" me-2">Mostrar completades</div>
              <input type="checkbox" name="showCompleted" id="showCompleted"
                checked={showCompleted}
                onChange={(event) =>
                  setShowCompleted(event.target.checked)} /> */}
            </div>
          </div>

        </div>
      }
    </>
  );
}