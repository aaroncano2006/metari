import { useState } from "react"

import type { assignationType } from "../../types/assignationType"
import { commentSchema } from "../../schemas/commentSchema"


type ModalProps = {
  assignation: assignationType
  assignationSetter: React.Dispatch<React.SetStateAction<assignationType | null>>
  
}

export function ModalAddComment({ assignation, assignationSetter }: ModalProps) {

  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    body: ""
  })


  return (
    <>
      <div className="modalOverlay h-100 w-100">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-6">
              <div className="modalWindow">
                <h5>Crea un comentari</h5>

                <form onSubmit={async (event) => {
                  event.preventDefault()

                }}
                >
                  <label htmlFor="body">Comentari</label>

                  <input className="form-control mb-2"
                    type="text" id="body"
                    onChange={(event) =>
                      setFormData({ ...formData, body: event.target.value })
                    }
                  />
                  {/* {errors.body && (
                    <small className="text-danger d-flex mb-2">{errors.body}</small>
                  )} */}

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