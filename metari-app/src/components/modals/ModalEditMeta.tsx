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
    description: meta.description
  })

  return (
    <>
      <div className="modalOverlay h-100 w-100">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-6">
              <div className="modalWindow">
                <h5>Edit Category</h5>

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
                  <input className="form-control mb-2"
                    type="text" value={formData.title}
                    onChange={(event) =>
                      setFormData({ ...formData, title: event.target.value })
                    }
                  />

                  <textarea className="form-control mb-2"
                    value={formData.description}
                    onChange={(event) =>
                      setFormData({ ...formData, description: event.target.value })
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