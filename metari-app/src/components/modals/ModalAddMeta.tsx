import { useState } from "react"

import type { metaType } from "../../types/metaType"
import type { assignationType } from "../../types/assignationType";
import { createAssignation } from "../../services/assignationService";
import { getUserId } from "../../services/auth/loginService";
import { assignationSchema } from "../../schemas/assignationSchema"




type ModalAddMetaProps = {
  meta: [metaType | null, string]
  setMetaToAdd: React.Dispatch<React.SetStateAction<[metaType | null, string]>>

}

export function ModalAddMeta({ meta, setMetaToAdd }: ModalAddMetaProps) {

  const difficultyOptions: assignationType["difficulty"][] = ["easy", "normal", "hard", "extreme"];
  const priorityOptions: assignationType["priority"][] = ["high", "low"];

// const [formData, setFormData] = useState({
//   meta_id: meta[0]?.id,
//   user_id: getUserId() ?? undefined,
//   start_date: new Date().toISOString().split("T")[0],
//   due_date: new Date().toISOString().split("T")[0],
//   priority:  formData.get("priority"),
//   difficulty: "",
// });
  const [errors, setErrors] = useState<Record<string, string>>({})

async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()
  const formData = new FormData(event.currentTarget)
  const data = {
  meta_id: Number(formData.get("meta_id")),
  user_id: Number(formData.get("user_id")),
  start_date: formData.get("start_date") as string,
  due_date: formData.get("due_date") as string,
  priority: (formData.get("priority") as string) || undefined,
  difficulty: formData.get("difficulty") as assignationType["difficulty"],
}
const validation = assignationSchema.safeParse(data)
if (!validation.success) {
  const fieldErrors: Record<string, string> = {}

        validation.error.issues.forEach((issue) => {
          const field = issue.path[0] as string
          fieldErrors[field] = issue.message
        })

        setErrors(fieldErrors)
  return
}

  // await createAssignation(data)
  await createAssignation(validation.data)
  setMetaToAdd([null, ""])
}


  return (
    <>
      <div className="modalOverlay h-100 w-100">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-6">
              <div className="modalWindow">

                <form onSubmit={handleSubmit}>
                  {meta[1] === "assign" &&

                    <div></div>
                  }
                  {meta[1] === "autoassign" &&
                    <>
                      <h5>Personalitza la teva meta</h5>

                      <div className="">
                        <div>Titol:{meta[0]?.title}</div>
                        {meta[0]?.description &&
                          <div>Descripcio:{meta[0]?.description}</div>
                        }
                        <input type="hidden" name="user_id" value={getUserId() ?? ""} />
                        <input type="hidden" name="meta_id" value={meta[0]?.id} />
                        <div>
                          <label htmlFor="start_date">📅 Inici:</label>
                          <input
                            className="form-control"
                            type="date"
                            name="start_date"
                            defaultValue={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                        <div>
                          <label htmlFor="due_date">⏳ Data límit</label>

                          <input className="form-control" type="date" name="due_date" 
                          // defaultValue={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                        <div>
                          <label htmlFor="priority">🔥 Prioritat:</label>
                          <select className="form-select mb-2" name="priority" id="priority"
                            
                            >
                            <option key={"empty"} value={""}>
                              {"Sense prioritat"}
                            </option>
                            {priorityOptions.map((priority) => (
                              <option key={priority} value={priority}>
                                {priority}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="difficulty">🎯 Dificultat</label>
                          <select className="form-select mb-2" defaultValue="normal" name="difficulty" id="difficulty"
                            >
                            {difficultyOptions.map((difficulty) => (
                              <option key={difficulty} value={difficulty}>
                                {difficulty}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>



                    </>
                  }


                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-secondary"
                      type="button"
                      onClick={() => setMetaToAdd([null, ""])}
                    >
                      Cancela
                    </button>

                    <button type="submit" className="btn btn-primary">
                      Afegeix la meta
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}