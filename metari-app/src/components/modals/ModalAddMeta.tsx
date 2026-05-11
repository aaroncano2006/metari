import { useState } from "react"

import type { metaType } from "../../types/metaType"
import type { assignationType } from "../../types/assignationType";
import { createAssignation } from "../../services/assignationService";
import { getUserId } from "../../services/auth/loginService";
import { assignationSchema } from "../../schemas/assignationSchema"
import type { groupType } from "../../types/groupType";




type ModalAddMetaProps = {
  meta: [metaType | null, string]
  setMetaToAdd: React.Dispatch<React.SetStateAction<[metaType | null, string]>>
  groups: groupType[]

}

export function ModalAddMeta({ meta, setMetaToAdd, groups }: ModalAddMetaProps) {

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

  const loggedInUserId = getUserId()
  const myGroups = groups.filter(group =>
    group.owner_id === loggedInUserId ||
    group.groupUsers.some(gu => gu.user_id === loggedInUserId)
  )
  const [selectedGroupId, setSelectedGroupId] = useState<number | "">("")

  const selectedGroupUsers = selectedGroupId !== ""
    ? myGroups.find(group => group.id === Number(selectedGroupId))?.groupUsers ?? []
    : []

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    // const data = {
    //   meta_id: Number(formData.get("meta_id")),
    //   group_id: Number(formData.get("group_id")) ?? undefined,
    //   // user_id: meta[1] === "assign" ? Number(formData.get("userToAssign")) : Number(formData.get("user_id")) , 
    //   user_id: meta[1] === "assign" ? (formData.get("userToAssign") ? Number(formData.get("userToAssign")) : undefined)
    //     : Number(formData.get("user_id")),
    //   assigner_id: Number(formData.get("assigner_id")) ?? undefined,
    //   needs_proofs: formData.get("needs_proofs") ?? undefined,
    //   start_date: formData.get("start_date") ,
    //   due_date: formData.get("due_date"),
    //   priority: (formData.get("priority")) || undefined,
    //   difficulty: formData.get("difficulty"),
    // }

    const data = {
      meta_id: Number(formData.get("meta_id")),
      group_id: formData.get("group_id") ? Number(formData.get("group_id")) || undefined : undefined,
      user_id: formData.get("user_id") ? Number(formData.get("user_id")) : undefined,
      // user_id: meta[1] === "assign"
      //   ? (formData.get("userToAssign") ? Number(formData.get("userToAssign")) : undefined)
      //   : Number(formData.get("user_id")) || undefined,
      // assigner_id: Number(formData.get("assigner_id")) || undefined,
      // needs_proofs: formData.get("needs_proofs") || undefined,
      start_date: formData.get("start_date"),
      due_date: formData.get("due_date"),
      priority: formData.get("priority") || undefined,
      difficulty: formData.get("difficulty"),
    }



    const validation = assignationSchema.safeParse(data)
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string
        fieldErrors[field] = issue.message
      })

      setErrors(fieldErrors)
      console.log("Zod validation errors:", validation.error.issues)
      return
    }

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
                              {"Sense prioritat/Normal"}
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
                  {meta[1] === "assign" &&
                    <>
                      <h5>Personalitza la meta a assignar</h5>

                      <div className="">
                        <div>Titol:{meta[0]?.title}</div>
                        {meta[0]?.description &&
                          <div>Descripcio:{meta[0]?.description}</div>
                        }
                        <input type="hidden" name="user_id" value={getUserId() ?? ""} />
                        <input type="hidden" name="assigner_id" value={loggedInUserId ?? ""} />
                        <input type="hidden" name="meta_id" value={meta[0]?.id} />


                        <div>
                          <label htmlFor="group_id">grup:</label>
                          <select className="form-select mb-2" name="group_id" id="group_id"
                            onChange={(e) => setSelectedGroupId(e.target.value ? Number(e.target.value) : "")}
                          >
                            <option key={"empty"} value={""}>
                              Tria un grup
                            </option>
                            {myGroups.map((group) => (
                              <option key={group.id} value={group.id}>
                                {group.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {meta[0]?.type === "task" &&
                          <div>
                            <label htmlFor="userToAssign">usuari del grup:</label>
                            <select className="form-select mb-2" name="userToAssign" id="userToAssign"
                            >
                              <option key={"empty"} value={""}>Assignar a tot el grup</option>
                              {selectedGroupUsers.map((grupUser) => (
                                <option key={grupUser.user_id} value={grupUser.user_id}>
                                  {grupUser.user.username}
                                </option>
                              ))}
                            </select>
                          </div>

                        }
                        <label className="me-5 my-2" htmlFor="needs_proofs">Proves necessaries?</label>
                        <input type="checkbox" name="needs_proofs" id="needs_proofs" />



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