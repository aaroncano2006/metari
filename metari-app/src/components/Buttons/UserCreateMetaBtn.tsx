import { ModalCreate } from "../modals/ModalCreate";
import { useState } from "react";
import {ModalUserCreateMeta} from "../modals/ModalUserCreateMeta"

type CreateBtnProps = {
  
}

export function UserCreateMetaBtn({}: CreateBtnProps){
  const [creatingMeta , setCreatingMeta] = useState<boolean>(false)

    return (
    <>
     <button className="btn btn-warning"
     onClick={() => setCreatingMeta(true)}>
     Crea una meta</button>


      {creatingMeta === true && 
        <ModalUserCreateMeta /> 
        }
    </>
  );
}