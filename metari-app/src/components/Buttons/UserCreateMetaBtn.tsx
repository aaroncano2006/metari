import { ModalCreate } from "../modals/ModalCreate";
import { useState } from "react";
import { ModalUserCreateMeta } from "../modals/ModalUserCreateMeta"
import type { metaType } from "../../types/metaType";
import type { categoryType } from "../../types/categoryType";

type CreateBtnProps = {
  setMetas: React.Dispatch<React.SetStateAction<metaType[]>>
  categories: categoryType[]
}

export function UserCreateMetaBtn({ setMetas, categories }: CreateBtnProps) {
  const [creatingMeta, setCreatingMeta] = useState(false)


  return (
    <>
      <div>

        <button className="btn btn-warning"
          onClick={() => setCreatingMeta(true)}>
          Crea una meta</button>

      </div>

      {creatingMeta === true &&
        <ModalUserCreateMeta setCreatingMeta={setCreatingMeta} setMetas={setMetas} categories={categories}/>
      }
    </>
  );
}