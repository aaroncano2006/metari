import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserProfilePicture } from "../components/UserProfilePicture";
import {
  getUserFullName,
  getUserId,
  getUserName,
  getUserStats,
} from "../services/auth/loginService";
import UserProfileForm from "../components/UserProfileForm";
import UserProfileStats from "../components/UserProfileStats";
import { getUserProfileData } from "../services/auth/profileService";
import SendFriendInvitationButton from "../components/Buttons/SendFriendInvitationBtn";
import { FriendList } from "../components/FriendList";
import { fetchFriends } from "../services/invitationService";
import type { userTypeFrontend } from "../types/userTypeFrontend";

export default function Profile() {
  // Redireccions i recarrega dinàmica de la pàgina
  const navigate = useNavigate();
  const [_recharge, setRecharge] = useState(0);

  const [error, setError] = useState<string | null>(null);

  // Controla si s'està consultant el perfil de l'usuari loguejat o d'un altre usuari.
  const [searchParams] = useSearchParams();
  const usernameSearchParam = searchParams.get("username") || "";
  const [userData, setUserData] = useState<any>(null);
  const id = userData?.id || getUserId();
  const name = userData?.name || getUserFullName();
  const username = userData?.username || getUserName();
  const [friendsList, setFriendsList] = useState<userTypeFrontend[]>([]);
  const stats = userData
    ? {
        score: userData.score,
        completed_tasks: userData.completed_tasks,
      }
    : getUserStats();
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await getUserProfileData(usernameSearchParam);
        if (user) {
          if (user.username === username) {
            return navigate("/profile");
          }
          setUserData(user);
        } else {
          throw new Error(`No s'ha trobat cap usuari amb el username: `);
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    const loadFriendsList = async () => {
      try {
        const friends = await fetchFriends(id);
        if (friends) {
          setFriendsList(friends);
        } else {
          throw new Error("Error carregant el llistat d'amics!");
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    if (usernameSearchParam) {
      loadProfile();
    } else {
      setUserData(null);
      loadFriendsList();
    }
  }, [usernameSearchParam]);

  useEffect(() => {
    const handleRecharge = () => setRecharge((cur) => cur + 1);
    window.addEventListener("profileChange", handleRecharge);
    return () => window.removeEventListener("profileChange", handleRecharge);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <div className="container-fluid p-3">
        {!error && (
          <>
            <header className="row ms-5 p-5">
              <div className="col-9">
                <h1>Profile</h1>
              </div>
              <div className="col pt-2">
                {userData && (
                  <SendFriendInvitationButton
                    receiverId={userData?.id}
                  ></SendFriendInvitationButton>
                )}
              </div>
            </header>

            <div className="row ms-5">
              <div className="col-md-4">
                <UserProfilePicture
                  url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwo8eJYb8h6_V7THlADVmoSbVkJQw6k08Liw&s"
                  id="userProfilePictureFromPage"
                />
                <div className="mt-3">
                  <h2>{name}</h2>
                  <h3 className="text-muted">{username}</h3>
                </div>
              </div>
              <div className="col-md-5 mb-2">
                {!userData && <UserProfileForm></UserProfileForm>}
              </div>
              <div className="col-md-2">
                <UserProfileStats
                  completed_tasks={stats?.completed_tasks}
                  score={stats?.score}
                ></UserProfileStats>
              </div>
            </div>
            <div className="row p-5">{!userData && <FriendList users={friendsList}></FriendList>}</div>
          </>
        )}
        {error && (
          <>
            <div className="alert alert-danger">
              {error}
              <strong>{usernameSearchParam}</strong>
            </div>
          </>
        )}
      </div>
    </>
  );
}
