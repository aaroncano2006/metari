import { useState } from "react"

import type { assignationType } from "../../types/assignationType"
import { commentSchema } from "../../schemas/commentSchema"
import { getUserId } from "../../services/auth/loginService"
import { createComment } from "../../services/commentService"

type ModalProps = {
  assignation: assignationType
  assignationSetter: React.Dispatch<React.SetStateAction<assignationType | null>>

}


export function ModalAddComment({ assignation, assignationSetter }: ModalProps) {

  const [errors, setErrors] = useState<Record<string, string>>({})

  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const data = {
      user_id: Number(getUserId()),
      assignation_id: assignation.id,
      body: String(formData.get("body") ?? "")
    }




    const validation = commentSchema.safeParse(data)
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

    await createComment(validation.data)
    assignationSetter(null)
  }



  return (
    <>
      <div className="modalOverlay h-100 w-100">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-6">
              <div className="modalWindow">
                <h5>Crea un comentari</h5>

                <form onSubmit={handleSubmit}
                >
                  <label htmlFor="body">Comentari</label>

                  <textarea className="form-control mb-2"
                    id="body" name="body"
                    
                  />
                  {errors.body && (
                    <small className="text-danger d-flex mb-2">{errors.body}</small>
                  )}

                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-secondary"
                      type="button"
                      onClick={() => assignationSetter(null)}
                    >
                      Cancela
                    </button>

                    <button type="submit" className="btn btn-primary">
                      Crea el comentari
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

