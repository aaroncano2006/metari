import { useState } from "react"

import type { metaType } from "../../types/metaType"




type ModalAddMetaToGroupProps = {
  meta: metaType
  setMetaToAdd: React.Dispatch<React.SetStateAction<metaType | null>>

}

export function ModalAddMetaToGroup({ meta, setMetaToAdd }: ModalAddMetaToGroupProps) {


  const [formData, setFormData] = useState({

  })


  return (
    <>
      <div className="modalOverlay h-100 w-100">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-6">
              <div className="modalWindow">
                <h5>Tria el grup al que afegir la meta</h5>

                <form onSubmit={async (event) => {
                  event.preventDefault()


                }}
                >

                  <div className="d-flex flex-column">
                    <label htmlFor="category">Grups dels que ets membre</label>
                    <select className="form-select mb-2" name="category" id="category"
                    >
                      {/* {categories.map((group: any) => (
                        <option key={category.id} value={category.id}>
                          {group.name}
                        </option>
                      ))} */}
                      <option value="una">una</option>
                      <option value="dos">dos</option>
                    </select>
                  </div>



                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-secondary"
                      type="button"
                      onClick={() => setMetaToAdd(null)}
                    >
                      Cancela
                    </button>

                    <button type="submit" className="btn btn-primary">
                      Afegeix al grup
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