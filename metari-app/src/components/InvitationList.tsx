import type { userTypeFrontend } from "../types/userTypeFrontend";
import { useState } from "react";
import { getUserName } from "../services/auth/loginService";
import { Link } from "react-router-dom";
import SendFriendInvitationButton from "./Buttons/SendFriendInvitationBtn";

type UserListProps = {
  invitations: any;
  setter?: React.Dispatch<React.SetStateAction<userTypeFrontend[]>>;
  target: "friends" | "groups";
};

export function InvitationList({ invitations, setter, target }: UserListProps) {
  const [openEntityId, setOpenEntityId] = useState<number | null>(null);
  const toggleEntity = (id: number) => {
    setOpenEntityId((prev) => (prev === id ? null : id));
  };
  const token = localStorage.getItem("token");
  const username = getUserName();

  return (
    <>
      {token && (
        <div className="metaList mt-4">
          <div className="titolComponent  text-center my-2">Invitacions</div>
          <hr className="m-0" />

          <div className="inline">
            {token && (
              <ul className="ps-2 m-0 py-2">
                {invitations.map((i: any) => (
                  <li key={i.id} className="m-0 p-0">
                    <div
                      className={`metaEntry mt-1 me-3 ps-2 ${openEntityId === i.id ? "mb-0" : "mb-1"}`}
                      onClick={() => toggleEntity(i.id)}
                    >
                      <div className="d-flex py-1 ps-2 pe-2 align-items-center">
                        <div className="me-auto">
                          {i.sender.username === username
                            ? i.receiver.username
                            : i.sender.username}
                        </div>
                        {token && target === "friends" && (
                          <Link
                            to={`/Profile?username=${i.sender.username === username ? i.receiver.username : i.sender.username}`}
                            className="btn btn-primary p-1 "
                          >
                            <i className="bi bi-person-fill"></i>
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className=" metaDetailsBox  my-0 me-3">
                      {openEntityId === i.id && (
                        <div className="metaDetails ps-2 py-2">
                          {target === "friends" && (
                            <strong>Invitació d'amistat</strong>
                          )}
                          {target === "groups" && (
                            <strong>Invitació al grup {i.group.name}</strong>
                          )}
                          <div>
                            Remitent: {i.sender.name} ({i.sender.username})
                          </div>
                          <div>
                            Receptor: {i.receiver.name} ({i.receiver.username})
                          </div>
                          <div className="justify-content-end">
                            {target === "friends" && (
                              <SendFriendInvitationButton
                                receiverId={i.receiver.id}
                              ></SendFriendInvitationButton>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
