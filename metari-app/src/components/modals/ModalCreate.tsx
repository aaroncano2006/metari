import { useState } from "react"
import { createCategory } from "../../services/categoryService"

import type { categoryType } from "../../types/categoryType"
import type { metaType } from "../../types/metaType"
import type { userTypeFrontend } from "../../types/userTypeFrontend"


export const formEditSchemas = {
  categories: { name: "", description: "" },
  metas: { title:"", description:"", author_id: "", group_id: "", type: ""},
  users: { username: "", email: "", role: "" }
};

type ModalEditProps = {
  setCreatingEntry: React.Dispatch<React.SetStateAction<string | null>>
  creatingEntry: string
}

export function ModalCreate({ setCreatingEntry, creatingEntry }: ModalEditProps) {

  const formSchema = formEditSchemas[creatingEntry as keyof typeof formEditSchemas];

  const [formData, setFormData] = useState(() =>
    Object.fromEntries(
      Object.entries(formSchema).map(([key]) => [key, ""])
    )
  );
  //fer-lo generalitzat
  // const [formData, setFormData] = useState({
  //   name: "",
  //   description: "category.description"
  // })




  return (
    <>
      <div className="modalOverlay h-100 w-100">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-6">
              <div className="modalWindow">
                <h5>Crea {creatingEntry}</h5>

                <form onSubmit={async (event) => {
                  event.preventDefault()
                }}
                >


                  {Object.keys(formSchema).map((key) => (
                    <div key={key}>
                      {key === "description"
                        ? (
                          <>
                            <label htmlFor={key}> {key}</label>
                            <textarea className="form-control mb-2"
                              value={formData[key]}
                              onChange={(e) => setFormData({
                                ...formData,
                                [key]: e.target.value
                              })
                              }
                            />
                          </>
                        )
                        : (
                          <>
                          <label htmlFor={key}> {key}</label>
                        <input className="form-control mb-2"
                          type="text"
                          value={formData[key]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [key]: e.target.value
                            })
                          }
                        />
                        </>
                        )}
                    </div>
                  ))}




                  {/* <input className="form-control mb-2"
                    type="text" value={formData.name}
                    onChange={(event) =>
                      setFormData({ ...formData, name: event.target.value })
                    }
                  />

                  <textarea className="form-control mb-2"
                    value={formData.description}
                    onChange={(event) =>
                      setFormData({ ...formData, description: event.target.value })
                    }
                  /> */}

                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-secondary"
                      type="button"
                      onClick={() => setCreatingEntry(null)}
                    >
                      Cancela
                    </button>

                    <button type="submit" className="btn btn-primary">
                      Actualitza
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