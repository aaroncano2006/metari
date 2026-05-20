import { ModalCreate } from "../modals/ModalCreate";
import { useState } from "react";
import { ModalUserCreateMeta } from "../modals/ModalUserCreateMeta"
import { ModalUserCreateGroup } from "../modals/ModalUserCreateGroup";
import type { metaType } from "../../types/metaType";
import type { groupType } from "../../types/groupType";

type CreateBtnProps = {
  setGroups: React.Dispatch<React.SetStateAction<groupType[]>>
}

export function UserCreateGroupBtn({ setGroups }: CreateBtnProps) {
  const [creatingGroup, setCreatingGroup] = useState(false)


  return (
    <>
      <div>

        <button className="btn createBtnHome"
          onClick={() => setCreatingGroup(true)}>
          <i className="bi bi-people-fill me-3"></i>Crea un grup</button>

      </div>

      {creatingGroup === true &&
        <ModalUserCreateGroup setCreatingGroup={setCreatingGroup} setGroups={setGroups} />
      }
    </>
  );
}