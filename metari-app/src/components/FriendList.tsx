import type { userTypeFrontend } from "../types/userTypeFrontend";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SendFriendInvitationButton from "../components/Buttons/SendFriendInvitationBtn";
import { fetchFriends } from "../services/invitationService";
import { getUserId } from "../services/auth/loginService";

type UserListProps = {
  users: userTypeFrontend[];
  setter?: React.Dispatch<React.SetStateAction<userTypeFrontend[]>>;
};

export function FriendList({ users, setter }: UserListProps) {
  const [openEntityId, setOpenEntityId] = useState<number | null>(null);
  const toggleEntity = (id: number) => {
    setOpenEntityId((prev) => (prev === id ? null : id));
  };

  const token = localStorage.getItem("token");
  const vistaActual = useLocation().pathname;

  useEffect(() => {
    const handleFriendsUpdate = () => {
      if (setter) {
        fetchFriends(getUserId()!).then(setter);
      }
    };
    window.addEventListener("buttonChange", handleFriendsUpdate);
    return () =>
      window.removeEventListener("buttonChange", handleFriendsUpdate);
  }, [setter]);

  return (
    <>
      {token && (
        <div className="metaList mt-4">
          <div className="titolComponent  text-center my-2"><i className="bi bi-person-fill text-primary "></i>Amics</div>
          {/* <hr className="m-0" /> */}

          <div className="inline">
            {token && (
              <ul className=" ps-3  m-0  pb-2">
                {users.map((user) => (
                  <li key={user.id} className="m-0 p-0">
                    <div
                      className={`metaEntry mt-1 me-3 ps-2 ${openEntityId === user.id ? "mb-0" : "mb-1"}`}
                      onClick={() => toggleEntity(user.id)}
                    >
                      <div className="d-flex ps-2 pe-2  align-items-center">
                        <i className="bi bi-person-circle profileIcon me-3"></i>
                        <div className="me-auto">{user.username}</div>
                        {token && (
                          <Link
                            to={`/profile?username=${user.username}`}
                            className="btn btn-primary p-1 me-2 smallButton"
                            title="Perfil d'usuari"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <i className="bi bi-person-fill"></i>
                          </Link>
                        )}
                        {token && (vistaActual === "/" || vistaActual === "/search" || vistaActual === "/mymetas" || vistaActual === "/mygroups") && (
                          <SendFriendInvitationButton
                            receiverId={user.id}
                            small={true}
                          />
                        )}
                      </div>
                    </div>
                    <div className=" metaDetailsBox  my-0 me-3">
                      {openEntityId === user.id && (
                        <div className="metaDetails ps-2 py-2">
                          <div><strong>🔖 Nom:</strong> {user.name}</div>
                          <div><strong>📧 e-mail:</strong> {user.email}</div>
                          <div><strong>✅ Tasques completades:</strong> {user.completed_tasks}</div>
                          <div><strong>💯 Puntuacio:</strong> {user.score}</div>
                          {vistaActual === "/profile" &&
                            user.id !== getUserId() && (
                              <div className="d-flex p-3 justify-content-end">
                                <SendFriendInvitationButton
                                  receiverId={user.id}
                                />
                              </div>
                            )}
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
