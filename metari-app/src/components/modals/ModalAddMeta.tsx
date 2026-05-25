import { useState } from "react"

import type { metaType } from "../../types/metaType"
import type { assignationType } from "../../types/assignationType";
import { createAssignation } from "../../services/assignationService";
import { getUserId } from "../../services/auth/loginService";
import { assignationSchema } from "../../schemas/assignationSchema"
// import { createAssignationSchema } from "../../schemas/assignationSchema"
import type { groupType } from "../../types/groupType";
import { createIndexedMeta } from "../../services/IndexerService";




type ModalAddMetaProps = {
  meta: [metaType | null, string]
  setMetaToAdd: React.Dispatch<React.SetStateAction<[metaType | null, string]>>
  groups: groupType[]

}

export function ModalAddMeta({ meta, setMetaToAdd, groups }: ModalAddMetaProps) {

  const difficultyOptions: assignationType["difficulty"][] = ["easy", "normal", "hard", "extreme"];
  const priorityOptions: assignationType["priority"][] = ["high", "low"];


  const [errors, setErrors] = useState<Record<string, string>>({})

  const loggedInUserId = getUserId()

  const myGroups = groups.filter(group =>
    group.owner_id === loggedInUserId ||
    group.groupUsers.some(gu => gu.user_id === loggedInUserId)
  )

  const myModeratedGroups = groups.filter(group =>
    group.groupUsers.some(gu => gu.user_id === loggedInUserId && gu.role === "moderator")
  )

  const [selectedGroupId, setSelectedGroupId] = useState<number | "">("")
  const [needsProofs, setNeedsProofs] = useState(false)

  const selectedGroupUsers = selectedGroupId !== ""
    ? myGroups.find(group => group.id === Number(selectedGroupId))?.groupUsers ?? []
    : []

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)


    const data = {
      meta_id: Number(formData.get("meta_id")),
      group_id: formData.get("group_id") ? Number(formData.get("group_id")) || undefined : undefined,
      // user_id: formData.get("user_id") ? Number(formData.get("user_id")) : undefined,
      user_id: meta[1] === "assign"
        ? (formData.get("userToAssign") ? Number(formData.get("userToAssign")) : undefined)
        : Number(formData.get("user_id")) || undefined,
      assigner_id: Number(formData.get("assigner_id")) || undefined,
      needs_proofs: needsProofs,
      score: formData.get("score") ? Number(formData.get("score")) : undefined,
      start_date: formData.get("start_date"),
      due_date: formData.get("due_date"),
      priority: formData.get("priority") || undefined,
      difficulty: formData.get("difficulty"),
      type: meta[0]?.type,
    }



    const validation = assignationSchema.safeParse(data)
    // const validation = createAssignationSchema(groups, loggedInUserId).safeParse(data)
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

    try {
      await createAssignation(validation.data)
       if (meta[0]?.type === "challenge" && loggedInUserId) {
        await createIndexedMeta({
          user_id: loggedInUserId,
          meta_id: meta[0].id,
        });
      }
      alert("Meta afegida correctament!")
      setMetaToAdd([null, ""])
    } catch (error) {
      alert("Error en afegir la meta")
    }
  }


  return (
    <>
      <div className="modalOverlay h-100 w-100">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-8 col-md-6 col-xl-4">
              <div className="modalWindow bg-form p-4 ">

                <form onSubmit={handleSubmit}>

                  {meta[1] === "autoassign" &&
                    <>
                      <h5 className="tiltWarp">Personalitza la teva meta</h5>

                      <div className="">
                        <div className="my-3">

                          <div><strong>Titol: </strong>{meta[0]?.title}</div>
                          {meta[0]?.description &&
                            <div><strong>Descripcio: </strong>{meta[0]?.description}</div>
                          }
                        </div>

                        <input type="hidden" name="user_id" value={getUserId() ?? ""} />
                        <input type="hidden" name="meta_id" value={meta[0]?.id} />

                        <div className="my-2">
                          <label htmlFor="start_date">📅 <strong>Inici:</strong></label>
                          <input
                            className="form-control"
                            type="date"
                            name="start_date"
                            defaultValue={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                        <div className="my-2">
                          <label htmlFor="due_date">⏳ <strong>Data límit</strong></label>

                          <input className="form-control" type="date" name="due_date"
                          // defaultValue={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                        <div className="my-2">
                          <label htmlFor="priority">🔥 <strong>Prioritat:</strong></label>
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
                          <label htmlFor="difficulty">🎯 <strong>Dificultat:</strong> </label>
                          <select className="form-select mb-2" defaultValue="normal" name="difficulty" id="difficulty"
                          >
                            {difficultyOptions.map((difficulty) => (
                              <option key={difficulty} value={difficulty}>
                                {difficulty}
                              </option>
                            ))}
                          </select>
                        </div>

                        {meta[0]?.type === "challenge" && (
                          <div>
                            <label htmlFor="score">🏆 Punts al completar:</label>
                            <input className="form-control mb-2" type="number" name="score" id="score" />
                          </div>
                        )}
                      </div>



                    </>
                  }
                  {meta[1] === "assign" &&
                    <>
                      <h5>Personalitza la meta a assignar</h5>

                      <div className="">
                        <div className="my-3">
                          <div><strong>Titol: </strong>{meta[0]?.title}</div>
                          {meta[0]?.description &&
                            <div><strong>Descripcio: </strong>{meta[0]?.description}</div>
                          }
                        </div>
                        <input type="hidden" name="user_id" value={getUserId() ?? ""} />
                        <input type="hidden" name="assigner_id" value={loggedInUserId ?? ""} />
                        <input type="hidden" name="meta_id" value={meta[0]?.id} />


                        <div>
                          <label htmlFor="group_id">{meta[0]?.type === "task" ? <strong>Grups dels que ets moderador:</strong> : <strong>Grups dels que formes part:</strong>}</label>
                          <select className="form-select mb-2" name="group_id" id="group_id"
                            onChange={(e) => setSelectedGroupId(e.target.value ? Number(e.target.value) : "")}
                          >
                            <option key={"empty"} value={""}>
                              Tria un grup
                            </option>
                            {/* {myGroups.map((group) => (
                              <option key={group.id} value={group.id}>
                                {group.name}
                              </option>
                            ))} */}
                            {(meta[0]?.type === "task" ? myModeratedGroups : myGroups).map((group) => (
                              <option key={group.id} value={group.id}>{group.name}</option>
                            ))}
                          </select>
                          {errors.group_id && <div className="text-danger small">{errors.group_id}</div>}
                        </div>

                        {meta[0]?.type === "task" &&
                          <div>
                            <label htmlFor="userToAssign"><strong>usuari del grup:</strong></label>
                            <select className="form-select mb-2" name="userToAssign" id="userToAssign"
                            >
                              <option key={"empty"} value={""}>Tria un usuari</option>
                              {selectedGroupUsers.map((grupUser) => (
                                <option key={grupUser.user_id} value={grupUser.user_id}>
                                  {grupUser.user.username}
                                </option>
                              ))}
                            </select>
                            {errors.user_id && <div className="text-danger small">{errors.user_id}</div>}
                          </div>

                        }
                        <label className="me-5 my-2" htmlFor="needs_proofs"><strong>Proves necessaries?</strong></label>
                        <input type="checkbox" name="needs_proofs" id="needs_proofs"
                          checked={needsProofs}
                          onChange={() => setNeedsProofs(prev => !prev)} />
                        {errors.needs_proofs && <div className="text-danger small">{errors.needs_proofs}</div>}



                        <div>
                          <label htmlFor="start_date">📅 <strong>Inici:</strong></label>
                          <input
                            className="form-control"
                            type="date"
                            name="start_date"
                            defaultValue={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                        <div>
                          <label htmlFor="due_date">⏳ <strong>Data límit:</strong></label>

                          <input className="form-control" type="date" name="due_date"
                          // defaultValue={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                        <div>
                          <label htmlFor="priority">🔥 <strong>Prioritat:</strong></label>
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
                          <label htmlFor="difficulty">🎯 <strong>Dificultat:</strong></label>
                          <select className="form-select mb-2" defaultValue="normal" name="difficulty" id="difficulty"
                          >
                            {difficultyOptions.map((difficulty) => (
                              <option key={difficulty} value={difficulty}>
                                {difficulty}
                              </option>
                            ))}
                          </select>
                        </div>

                        {meta[0]?.type === "challenge" && (
                          <div>
                            <label htmlFor="score">🏆 <strong>Punts al completar:</strong></label>
                            <input className="form-control mb-2" type="number" name="score" id="score" />
                          </div>
                        )}
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