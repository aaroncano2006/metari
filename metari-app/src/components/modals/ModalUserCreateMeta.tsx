import { useState, useEffect } from "react"

import type { assignationType } from "../../types/assignationType"
import { commentSchema } from "../../schemas/commentSchema"
import { getUserId } from "../../services/auth/loginService"
import { createComment, updateComment } from "../../services/commentService"
import type { commentType } from "../../types/commentType"

type ModalProps = {
  
}


export function ModalUserCreateMeta({}: ModalProps) {

  

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    
      
    
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
                  
                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-secondary"
                      type="button"
                      // onClick={() => assignationSetter(null)}

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

