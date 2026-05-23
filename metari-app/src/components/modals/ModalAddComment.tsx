import { useState, useEffect } from "react"

import type { assignationType } from "../../types/assignationType"
import { commentSchema } from "../../schemas/commentSchema"
import { getUserId } from "../../services/auth/loginService"
import { createComment, updateComment } from "../../services/commentService"
import type { commentType } from "../../types/commentType"

type ModalProps = {
  assignation: assignationType
  assignationSetter: React.Dispatch<React.SetStateAction<assignationType | null>>
  commentSetter: React.Dispatch<React.SetStateAction<commentType[]>>
  commentFormType: string | null
  comment?: commentType
}


export function ModalAddComment({ assignation, assignationSetter, commentSetter: commentsSetter, commentFormType, comment }: ModalProps) {

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [body, setBody] = useState(comment?.body ?? "")

  useEffect(() => {
    setBody(comment?.body ?? "")
  }, [comment])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const currentComment = comment

    const formData = new FormData(event.currentTarget)

    if (commentFormType === "create") {
      const data = {
        user_id: getUserId(),
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
        return

      }
      setErrors({})
      try {
        const newComment = await createComment(validation.data)
        commentsSetter(prev => [...prev, newComment])
        assignationSetter(null)
        alert("Comentari creat correctament")
      } catch (error) {
        alert("Error en crear el comentari")
      }
    }

    if (commentFormType === "edit") {
      const data = {
        user_id: getUserId(),
        assignation_id: assignation.id,
        body: body
      }

      const validation = commentSchema.safeParse(data)

      if (!validation.success) {
        const fieldErrors: Record<string, string> = {}

        validation.error.issues.forEach((issue) => {
          const field = issue.path[0] as string
          fieldErrors[field] = issue.message
        })

        setErrors(fieldErrors)
        return

      }
      setErrors({})
      if (!currentComment) {
        alert("Error: no s'ha trobat el comentari a editar")
        return
      }
      try {
        const updatedComment = await updateComment(currentComment.id, validation.data)
        commentsSetter(prev => prev.map(c => c.id === updatedComment.id ? updatedComment : c))
        assignationSetter(null)
        alert("Comentari actualitzat correctament")
      } catch (error) {
        alert("Error en actualitzar el comentari")
      }
    }
  }



  return (
    <>
      <div className="modalOverlay h-100 w-100">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-8 col-md-6 col-xl-4">
              <div className="modalWindow bg-form  p-4">
                <h5 className="tiltWarp">Crea un comentari</h5>

                <form onSubmit={handleSubmit}>
                  <label htmlFor="body"><strong>Comentari:</strong></label>

                  <textarea className="form-control mb-2"
                    id="body" name="body"
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
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
                      {commentFormType === "edit" ? "Desa els canvis" : "Crea el comentari"}
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

