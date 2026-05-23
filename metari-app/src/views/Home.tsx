import { useEffect, useState } from "react";
import { fetchCategories } from "../services/categoryService";
import { fetchMetas } from "../services/metaService";
import { UserList } from "../components/UserList";
import { MetaList } from "../components/MetaList";
import { CategoryList } from "../components/CategoryList";
import { GroupList } from "../components/GroupList";
import { MyGroupsList } from "../components/MyGroupsList";
import { FriendList } from "../components/FriendList";
import { fetchUsers } from "../services/userService";
import type { userTypeFrontend } from "../types/userTypeFrontend";
import type { categoryType } from "../types/categoryType";
import type { groupType } from "../types/groupType";
import type { metaType } from "../types/metaType";
import { fetchGroups } from "../services/groupService";
import { getUserId } from "../services/auth/loginService";
import { fetchFriends } from "../services/invitationService";
import { fetchAssignations } from "../services/assignationService";
import type { assignationType } from "../types/assignationType";
import { UserCreateMetaBtn } from "../components/Buttons/UserCreateMetaBtn";
import { UserCreateGroupBtn } from "../components/Buttons/UserCreateGroupBtn";
import { Helmet } from "react-helmet-async";
import SearchBar from "../components/SearchBar";

// import { useMetas } from "../services/metaService"
// import { useCategories } from "../services/categoryService"

export default function Home() {
  const [users, setUsers] = useState<userTypeFrontend[]>([]);
  const [metas, setMetas] = useState<metaType[]>([]);
  const [categories, setCategories] = useState<categoryType[]>([]);
  const [groups, setGroups] = useState<groupType[]>([]);
  const [myGroups, setMyGroups] = useState<groupType[]>([]);
  const [friends, setFriends] = useState<userTypeFrontend[]>([]);
  const [_assignations, setAssignations] = useState<assignationType[]>([]);

  const token = localStorage.getItem("token");

  const [filteredCategory, setFilteredCategory] = useState<number | null>(null);
  // const [groupModeratorPanel, setGroupModeratorPanel] = useState<groupType | null>(null);

  const fetchMyGroups = () => {
    fetchGroups().then((response) => {
      const filteredByPublic = response.filter(
        (el) =>
          el.owner_id === getUserId() ||
          el.groupUsers.some((gu) => gu.user_id === getUserId()),
      );
      setMyGroups(filteredByPublic);
    }).catch(() => { });
  };

  useEffect(() => {
    fetchUsers().then(setUsers).catch(() => { });
    fetchCategories().then(setCategories).catch(() => { });
    fetchMetas().then(setMetas).catch(() => { });
    fetchGroups().then(setGroups).catch(() => { });
    fetchMyGroups();
    if (token) {
      fetchFriends(getUserId()!).then(setFriends).catch(() => { });
      fetchAssignations().then(setAssignations).catch(() => { });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("buttonChange", fetchMyGroups);
    return () => window.removeEventListener("buttonChange", fetchMyGroups);
  }, []);

  return (
    <>
      <Helmet>
        <title>Metari · Home - Comunitats, objectius i connexions</title>
      </Helmet>
      
      <div className="container-fluid banner pb-4 pt-3">
        <h1 className="py-3 titol flex flex-column align-content-center text-center">
          Benvingut a Metari
        </h1>
        {!token && 
          <h2 className="text-center text-muted">Organitza metes, crea hàbits, avança.</h2>
        }
        {token && (
          <>
          <div className="d-flex gap-2 justify-content-center">
            <UserCreateMetaBtn setMetas={setMetas} categories={categories} />
            <UserCreateGroupBtn setGroups={setGroups} />
            {/* {groups[0] && (
                <button
                className="btn btn-outline-primary"
                  onClick={() => setGroupModeratorPanel(groups[0])}
                  >
                  Panell de grup
                  </button>
              )} */}
          </div>
                  </>
        )}
      </div>


      <div className="container">
        <div className="row">

          <div className="col-12 col-md-6 col-xl-4 mx-auto pt-4 ">
            <SearchBar />
          </div>
        </div>
        <div className="row  g-2 gx-md-4 gx-lg-5 mb-5">

          <div className="col-12 col-sm-5 col-md-4 col-xl-3">
            <CategoryList
              categories={categories}
              setter={setCategories}
              filteredCategory={filteredCategory}
              setFilteredCategory={setFilteredCategory}
            />
          </div>

          <div className="col-12 col-sm-7 col-md-8 col-xl-6">
            <MetaList
              metas={metas}
              setter={setMetas}
              filteredCategory={filteredCategory}
              groups={myGroups}
            />
            {/* <MyMetaList assignations={assignations}/> */}
          </div>
          <div className="col-12 col-xl-3">
            <div className="row g-2 gx-md-4 gx-lg-5">

              <div className="col-12 col-sm-6 col-xl-12">
                <FriendList users={friends} setter={setFriends} />
              </div>

              <div className="col-12 col-sm-6 col-xl-12">
                <MyGroupsList groups={myGroups} setter={setMyGroups} />
              </div>

              <div className="col-12 col-sm-6 col-xl-12">
                <UserList users={users} setter={setUsers} isTop10={true} />
              </div>

              <div className="col-12 col-sm-6 col-xl-12">
                <GroupList groups={groups} setter={setGroups} isTop10={true} />
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
