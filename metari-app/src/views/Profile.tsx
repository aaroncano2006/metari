import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserProfilePicture } from "../components/UserProfilePicture";
import profileImg from "../assets/img/profileImg.png";
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
import SendGroupInvitationBtn from "../components/Buttons/SendGroupInvitationBtn";
import { FriendList } from "../components/FriendList";
import {
  fetchFriends,
  fetchMyInvitations,
} from "../services/invitationService";
import type { userTypeFrontend } from "../types/userTypeFrontend";
import { MyGroupsList } from "../components/MyGroupsList";
import type { groupType } from "../types/groupType";
import { fetchGroupsByUserId } from "../services/groupService";
import { Helmet } from "react-helmet-async";
import { InvitationList } from "../components/InvitationList";

import { fetchMetasByUserId } from "../services/metaService";
import { UserCreatedMetas } from "../components/UserCreatedMetas";
import type { metaType } from "../types/metaType";

export default function Profile() {
  // Redireccions i recarrega dinàmica de la pàgina
  const navigate = useNavigate();
  const [recharge, setRecharge] = useState(0);
  const [friendInvitationPanelActive, setFriendInvitationPanelActive] =
    useState<boolean>(false);
  const [groupInvitationPanelActive, setGroupInvitationPanelActive] =
    useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  // Controla si s'està consultant el perfil de l'usuari loguejat o d'un altre usuari.
  const [searchParams] = useSearchParams();
  const usernameSearchParam = searchParams.get("username") || "";
  const friendInvitationSearchParam = searchParams.get("friendInvitations") || "";
  const groupInvitationSearchParam = searchParams.get("groupInvitations") || "";
  const [userData, setUserData] = useState<any>(null);
  const name = userData?.name || getUserFullName();
  const username = userData?.username || getUserName();
  const [friendsList, setFriendsList] = useState<userTypeFrontend[]>([]);
  const [groupsList, setGroupsList] = useState<groupType[]>([]);
  const [friendInvitations, setFriendInvitations] = useState<any[]>([]);
  const [groupInvitations, setGroupInvitations] = useState<any[]>([]);
  const [createdMetas, setCreatedMetas] = useState<metaType[]>([]);
  const [myGroupsForInvite, setMyGroupsForInvite] = useState<groupType[]>([]);
  const [selectedGroupForInvite, setSelectedGroupForInvite] = useState<number | null>(null);

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
          if (user.username === getUserName()) {
            return navigate("/profile");
          }
          setUserData(user);
          const [friends, groups, myGroups, metas] = await Promise.all([
            fetchFriends(user.id),
            fetchGroupsByUserId(user.id),
            fetchGroupsByUserId(getUserId()!),
            fetchMetasByUserId(user.id),
          ]);
          setFriendsList(friends);
          setGroupsList(groups);
          setMyGroupsForInvite(myGroups);
          if (myGroups.length > 0) {
            setSelectedGroupForInvite(myGroups[0].id);
          }
          setCreatedMetas(metas);
        } else {
          throw new Error(`No s'ha trobat cap usuari amb el username: `);
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    if (usernameSearchParam) {
      loadProfile();
    } else {
      setUserData(null);
      const loadOwnData = async () => {
        const [friends, groups, friendInv, groupInv, metas] = await Promise.all([
          fetchFriends(getUserId()!),
          fetchGroupsByUserId(getUserId()!),
          fetchMyInvitations(getUserId()!, "pending").then((response) =>
            response.filter((el: any) => el.group_id === null),
          ),
          fetchMyInvitations(getUserId()!, "pending").then((response) =>
            response.filter((el: any) => el.group_id !== null),
          ),
          fetchMetasByUserId(getUserId()!),
        ]);
        setCreatedMetas(metas);
        setFriendsList(friends);
        setGroupsList(groups);
        setFriendInvitations(friendInv);
        setGroupInvitations(groupInv);
      };
      loadOwnData();
    }

    if (friendInvitationSearchParam === "true") {
      setFriendInvitationPanelActive(true);
    }

    if (groupInvitationSearchParam === "true") {
      setGroupInvitationPanelActive(true)
    }
  }, [usernameSearchParam, recharge]);

  useEffect(() => {
    const handleRecharge = () => setRecharge((cur) => cur + 1);
    window.addEventListener("profileChange", handleRecharge);
    window.addEventListener("buttonChange", handleRecharge);
    return () => {
      window.removeEventListener("profileChange", handleRecharge);
      window.removeEventListener("buttonChange", handleRecharge);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, []);

  const changeList = (target: string) => {
    const validTargets = ["friends", "groups"];

    if (!validTargets.includes(target)) return;

    if (target === "friends") {
      setFriendInvitationPanelActive((prev) => (!prev ? true : false));
    } else {
      setGroupInvitationPanelActive((prev) => (!prev ? true : false));
    }
  };

  return (
    <>
      <Helmet>
        <title>{`Metari · Profile - ${username} (${name})`}</title>
      </Helmet>
      <div className="container-fluid banner pb-4 pt-3">
        <h1 className="py-3 titol flex flex-column align-content-center text-center">Metari</h1>
      </div>

      <div className="container p-3">
        {!error && (
          <>
            <header className="row py-5">
              <div className="col-9">
                <h1>Perfil d'usuari</h1>
              </div>

            </header>

            {/* perfil i formulari */}
            <div className="row mb-4">

              <div className="col-12 col-md-4 text-center mb-4 ">

                <UserProfilePicture
                  // url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwo8eJYb8h6_V7THlADVmoSbVkJQw6k08Liw&s"
                  url={profileImg}
                  id="userProfilePictureFromPage"
                />
                <div className="mt-3">
                  <h2>{name}</h2>
                  <h3 className="text-muted">{username}</h3>
                </div>
              </div>

              {/* invitacions */}
              {userData && (
                <div className="d-md-block col pt-2 d-flex justify-content-center mb-5">
                  <>
                    <div className="d-flex d-md-block gap-3">
                      <SendFriendInvitationButton receiverId={userData?.id} />
                      <div className="d-flex gap-3 mt-md-3">
                        {myGroupsForInvite.length > 0 && selectedGroupForInvite && (
                          <SendGroupInvitationBtn receiverId={userData.id} groupId={selectedGroupForInvite} />
                        )}

                        {myGroupsForInvite.length > 0 && (
                          <select
                            className="form-select form-select-sm"
                            style={{ width: "auto" }}
                            value={selectedGroupForInvite ?? ""}
                            onChange={(e) =>
                              setSelectedGroupForInvite(parseInt(e.target.value))
                            }
                          >
                            {myGroupsForInvite.map((g) => (
                              <option key={g.id} value={g.id}>
                                {g.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                    </div>
                  </>
                </div>
              )}



              {!userData && (
                <>
                  <div className=" col-12 col-md me-lg-5 mb-5">
                    <div className="mx-3">
                      <h2>Edita el perfil</h2>
                      <UserProfileForm></UserProfileForm>
                    </div>
                  </div>

                  <div className="col-12 col-md-4 col-xl-3 mb-5">
                    <div className="userProfileStats mx-auto">
                      <UserProfileStats
                        completed_tasks={stats?.completed_tasks}
                        score={stats?.score}
                      ></UserProfileStats>
                    </div>
                  </div>
                </>

              )}


              {userData && (
                <>
                  <div className=" col-12 col-md-4 mx-lg-4 mb-4">
                    <div className="userProfileStats mx-auto mb-4">
                      <UserProfileStats
                        completed_tasks={stats?.completed_tasks}
                        score={stats?.score}
                      ></UserProfileStats>

                      <FriendList users={friendsList}></FriendList>

                      <MyGroupsList
                        groups={groupsList}
                        setter={setGroupsList}
                      ></MyGroupsList>
                    </div>
                  </div>
                </>
              )}
            </div>



            {/*  invitacions amics i grups*/}
            {!userData && (
              <>
                {/* panell amics */}
                <div className="row mb-4">
                  <div className="col-12 col-md-6 mb-4">
                    <div>
                      <button
                        className="btn btn-primary"
                        onClick={() => changeList("friends")}
                      >
                        {!friendInvitationPanelActive && (
                          <>
                            <i className="bi bi-envelope-fill me-2"></i>
                            Veure invitacions
                          </>
                        )}
                        {friendInvitationPanelActive && (
                          <>
                            <i className="bi bi-person-fill me-2"></i>
                            Veure amics
                          </>
                        )}
                      </button>
                    </div>

                    <a id="friends_and_groups"></a>

                    {!friendInvitationPanelActive && (
                      <FriendList users={friendsList}></FriendList>
                    )}
                    {friendInvitationPanelActive && (
                      <InvitationList invitations={friendInvitations} target="friends"></InvitationList>
                    )}
                  </div>
                  {/* </div> */}

                  {/* panell grups */}
                  {/* <div className="row ps-5 pe-5"> */}
                  <div className="col-12 col-md-6">
                    <button
                      className="btn btn-primary"
                      onClick={() => changeList("groups")}
                    >
                      {!groupInvitationPanelActive && (
                        <>
                          <i className="bi bi-envelope-fill me-2"></i> Veure
                          invitacions
                        </>
                      )}
                      {groupInvitationPanelActive && (
                        <>
                          <i className="bi bi-people-fill me-2"></i> Veure grups
                        </>
                      )}
                    </button>

                    {!groupInvitationPanelActive && (
                      <MyGroupsList groups={groupsList} setter={setGroupsList}></MyGroupsList>
                    )}
                    {groupInvitationPanelActive && (
                      <InvitationList invitations={groupInvitations} target="groups"></InvitationList>
                    )}
                  </div>
                </div>
              </>
            )}
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

        {!userData && (
          <div className="mb-4">
            <UserCreatedMetas metas={createdMetas} setter={setCreatedMetas} />
          </div>
        )}
      </div>
    </>
  );
}
