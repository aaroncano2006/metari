import { useState, useEffect } from "react"
import { createCategory } from "../../services/categoryService"
import { createMeta } from "../../services/metaService"
import { fetchCategories } from "../../services/categoryService"

import type { categoryType } from "../../types/categoryType"
import type { metaType } from "../../types/metaType"
import type { userTypeFrontend } from "../../types/userTypeFrontend"


//schemas for zod
import { metaSchema } from "../../schemas/metaSchema"
import { categorySchema } from "../../schemas/categorySchema"
import { userSchema } from "../../schemas/userSchema"
import { groupSchema } from "../../schemas/groupSchema"
import { getUserId } from "../../services/auth/loginService"


type ModalEditProps = {
  setCreatingEntry: React.Dispatch<React.SetStateAction<string | null>>
  creatingEntry: string
  setter?: React.Dispatch<React.SetStateAction<any[]>>
}

export function ModalCreate({ setCreatingEntry, creatingEntry, setter }: ModalEditProps) {

  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories()
      setCategories(data)
    }

    loadCategories()
  }, [])

  const [errors, setErrors] = useState<Record<string, string>>({})

  // seleccionem schema segons el cas
  function getSchema() {
    switch (creatingEntry) {
      case "metas":
        return metaSchema
      case "categories":
        return categorySchema
      case "usuaris":
        return userSchema
      case "grups":
        return groupSchema
      default:
        return null
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const schema = getSchema()
    if (!schema) {
      return
    }

    if (creatingEntry === "metas") {
      const data = {
        title: formData.get("title"),
        description: formData.get("description"),
        category_id: Number(formData.get("category_id")),
        type: formData.get("type"),
        author_id: getUserId(),
      }

      const validation = metaSchema.safeParse(data)

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
      if (setter) {
        setter(prev => [...prev, newMeta])
      }
    }

    if (creatingEntry === "categories") {
      const data = {
        name: formData.get("name"),
        description: formData.get("description"),
      }

      const validation = categorySchema.safeParse(data)
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

      // await createCategory(validation.data)
      const newCategory = await createCategory(validation.data)
      if (setter) {
        setter(prev => [...prev, newCategory])
      }
    }

    setCreatingEntry(null)
  }


  const inputsFormulari = () => {
    if (creatingEntry === "metas") {

      //indexed access type
      const metaTypeOptions: metaType["type"][] = ["task", "challenge"];


      return (
        <>
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
        </>
      );
    }

    if (creatingEntry === "categories") {
      return (
        <>
          <div className="d-flex flex-column">
            <label htmlFor="name">Nom</label>
            <input className="form-control mb-2" type="text" name="name" id="name" />
          </div>
          {errors.name && (
            <small className="text-danger d-block mb-2">
              {errors.name}
            </small>
          )}

          <div className="d-flex flex-column">
            <label htmlFor="description">Descripcio</label>
            <textarea className="form-control mb-2" name="description" id="description" />
          </div>
          {errors.description && (
            <small className="text-danger d-block mb-2">
              {errors.description}
            </small>
          )}
        </>
      );
    }

    if (creatingEntry === "usuaris") {
      return (
        <>
          <div className="d-flex flex-column">
            <label htmlFor="username">Username</label>
            <input className="form-control mb-2" type="text" name="username" id="username" />
          </div>

          <div className="d-flex flex-column">
            <label htmlFor="email">Email</label>
            <input className="form-control mb-2" type="text" name="email" id="email" />
          </div>

          <div className="d-flex flex-column">
            <label htmlFor="role">Role</label>
            <input className="form-control mb-2" type="text" name="role" id="role" />
          </div>
        </>
      );
    }

    if (creatingEntry === "grups") {
      return (
        <>
          <div className="d-flex flex-column">
            <label htmlFor="group">nom</label>
            <input className="form-control mb-2" type="text" name="group" id="group" />
          </div>
        </>
      );
    }

    return null;
  };


  return (
    <>
      <div className="modalOverlay h-100 w-100">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-6">
              <div className="modalWindow">
                <h5>Crea {creatingEntry}</h5>

                <form onSubmit={handleSubmit}
                >
                  {inputsFormulari()}

                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-secondary"
                      type="button"
                      onClick={() => setCreatingEntry(null)}
                    >
                      Cancela
                    </button>

                    <button type="submit" className="btn btn-primary">
                      Crea
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