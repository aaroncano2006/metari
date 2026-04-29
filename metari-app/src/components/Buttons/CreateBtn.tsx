import { ModalCreate } from "../modals/ModalCreate";
import { useState } from "react";


type CreateBtnProps = {
  menuSelection: string
}

export function CreateBtn({menuSelection}: CreateBtnProps){
  const [creatingEntry , setCreatingEntry] = useState<string | null>(null)

    return (
    <>
     <button className="btn btn-warning"
     onClick={() => setCreatingEntry(menuSelection)}>
     Crea nova entrada</button>


      {creatingEntry && (
        <ModalCreate creatingEntry={creatingEntry} setCreatingEntry={setCreatingEntry}/> )}
    </>
  );
}