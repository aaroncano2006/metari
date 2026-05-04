import type { metaType } from "../../types/metaType"
import { useState } from "react"

import { updateMeta } from "../../services/metaService"


type ModalEditProps = {
  meta: metaType
  setEditMeta: React.Dispatch<React.SetStateAction<metaType | null>>
  setter: React.Dispatch<React.SetStateAction<metaType[]>>
}

export function ModalEditMeta({ meta, setEditMeta, setter }: ModalEditProps) {

  const [formData, setFormData] = useState({
    title: meta.title,
    description: meta.description,
    author_id: meta.author_id,
    group_id: meta.group_id,
    category_id: meta.category_id,
    type: meta.type,
  })

  return (
    <>
      <div className="modalOverlay h-100 w-100">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-6">
              <div className="modalWindow">
                <h5>Edita Meta</h5>

                <form onSubmit={async (event) => {
                  event.preventDefault()

                  const updatedMeta = await updateMeta(meta.id, formData)

                  setter(prev =>
                    prev.map(metas =>
                      metas.id === meta.id
                        ? updatedMeta
                        : metas
                    )
                  )

                  setEditMeta(null)

                }}
                >
                  <label htmlFor="title">Titol</label>
                  <input className="form-control mb-2"
                    type="text" value={formData.title} id="title"
                    onChange={(event) =>
                      setFormData({ ...formData, title: event.target.value })
                    }
                  />

                  <label htmlFor="description">Descripcio</label>
                  <textarea className="form-control mb-2"
                    value={formData.description} id="description"
                    onChange={(event) =>
                      setFormData({ ...formData, description: event.target.value })
                    }
                  />
                  <label htmlFor="type">Tipus</label>
                  <input className="form-control mb-2"
                    type="text" value={formData.type} id="type"
                    onChange={(event) =>
                      setFormData({ ...formData, type: event.target.value as "task" | "challenge"  })
                    }
                  />
                  <label htmlFor="author_id">Autor</label>

                  <input className="form-control mb-2"
                    type="number" value={formData.author_id} id="author_id"
                    onChange={(event) =>
                      setFormData({ ...formData, author_id: Number(event.target.value) })
                    }
                  />



                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-secondary"
                      type="button"
                      onClick={() => setEditMeta(null)}
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