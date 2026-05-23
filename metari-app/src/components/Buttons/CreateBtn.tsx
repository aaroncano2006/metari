import { ModalCreate } from "../modals/ModalCreate";
import { useState } from "react";


type CreateBtnProps = {
  menuSelection: string
  setter?: React.Dispatch<React.SetStateAction<any[]>>
}

export function CreateBtn({menuSelection, setter}: CreateBtnProps){
  const [creatingEntry , setCreatingEntry] = useState<string | null>(null)

    return (
    <>
     <button className="btn btnCreate btn-warning"
     onClick={() => setCreatingEntry(menuSelection)}>
     Crea {menuSelection}</button>


      {creatingEntry && (
        <ModalCreate creatingEntry={creatingEntry} setCreatingEntry={setCreatingEntry} setter={setter}/> )}
    </>
  );
}