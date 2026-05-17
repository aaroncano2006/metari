import { useState, useEffect } from "react"

import type { assignationType } from "../../types/assignationType"
import { commentSchema } from "../../schemas/commentSchema"
import { getUserId } from "../../services/auth/loginService"
import { createComment, updateComment } from "../../services/commentService"
import type { commentType } from "../../types/commentType"
import type { categoryType } from "../../types/categoryType"
import type { metaType } from "../../types/metaType"
import { createIndexedMeta } from "../../services/IndexerService"
import { createMeta } from "../../services/metaService"
import { metaSchema } from "../../schemas/metaSchema"
import { indexSchema } from "../../schemas/indexSchema"


type ModalProps = {
  setCreatingMeta: React.Dispatch<React.SetStateAction<boolean>>
  categories: categoryType[]
}


export function ModalUserCreateMeta({ setCreatingMeta, categories }: ModalProps) {

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPublic, setIsPublic] = useState<boolean>(true)
  const [needsProofs, setNeedsProofs] = useState<boolean>(false)
  const metaTypeOptions: metaType["type"][] = ["task", "challenge"];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)


    const metaData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category_id: formData.get("category_id") ? Number(formData.get("category_id")) : undefined,
      type: formData.get("type"),
      author_id: getUserId(),
      is_public: formData.get("is_public") !== null
    }

    const validation = metaSchema.safeParse(metaData)

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


    const newMeta = await createMeta(validation.data)
    
    const indexedMetaData = {
      user_id: getUserId(),
      meta_id: newMeta.id,
      
    }
    
    const indexedValidation = indexSchema.safeParse(indexedMetaData)
    if (indexedValidation.success) {
      await createIndexedMeta(indexedValidation.data)
    }
    
    setCreatingMeta(false)


  }



  return (
    <>
      <div className="modalOverlay h-100 w-100">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-6">
              <div className="modalWindow">
                <h5>Crea una meta</h5>

                <form onSubmit={handleSubmit}>


                  <div className="d-flex flex-column">
                    <label htmlFor="title">Títol</label>
                    <input className="form-control mb-2" type="text" name="title" id="title" />
                  </div>
                  {errors.title && (
                    <small className="text-danger d-block mb-2">
                      {errors.title}
                    </small>
                  )}

                  <div className="d-flex flex-column">
                    <label htmlFor="description">Descripció</label>
                    <textarea className="form-control mb-2" name="description" id="description" />
                  </div>
                  {errors.description && (
                    <small className="text-danger d-block mb-2">
                      {errors.description}
                    </small>
                  )}

                  <div className="d-flex flex-column">
                    <label htmlFor="type">Tipus</label>
                    <select className="form-select mb-2" name="type" id="type">

                      {metaTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="d-flex flex-column">
                    <label htmlFor="category_id">Categoria</label>
                    <select className="form-select mb-2" name="category_id" id="category_id"
                    >
                      {categories.map((category: any) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="me-5 my-2" htmlFor="is_public">Es publica?</label>
                    <input type="checkbox" name="is_public" id="is_public" checked={isPublic}
                      // onChange={() => setNeedsProofs(prev => !prev)}
                      onChange={(e) => setIsPublic(e.target.checked)}
                    />
                  </div>

                  {isPublic === false &&
                    <>
                      <div>
                        <label htmlFor="group_id">Grups dels que formes part:</label>
                        <select className="form-select mb-2" name="group_id" id="group_id"
                        // onChange={(e) => setSelectedGroupId(e.target.value ? Number(e.target.value) : "")}
                        >
                          <option key={"empty"} value={""}>
                            Tria un grup
                          </option>
                          {/* {myGroups.map((group) => (
                              <option key={group.id} value={group.id}>
                              {group.name}
                              </option>
                              ))} */}
                          {/* {(meta[0]?.type === "task" ? myModeratedGroups : myGroups).map((group) => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                        ))} */}
                        </select>
                        {errors.group_id && <div className="text-danger small">{errors.group_id}</div>}
                      </div>
                      <div>
                        <label className="me-5 my-2" htmlFor="needs_proofs">Proves necessaries?</label>
                        <input type="checkbox" name="needs_proofs" id="needs_proofs"
                          onChange={() => setNeedsProofs(prev => !prev)} />
                      </div>
                    </>
                  }




                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-secondary"
                      type="button"
                      onClick={() => setCreatingMeta(false)}

                    >
                      Cancela
                    </button>

                    <button type="submit" className="btn btn-primary">
                      Crea la meta
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

