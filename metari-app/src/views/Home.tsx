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
import ModalGroupModeratorPanel from "../components/modals/ModalGroupModeratorPanel";

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
    });
  };

  useEffect(() => {
    fetchUsers().then(setUsers);
    fetchCategories().then(setCategories);
    fetchMetas().then(setMetas);
    fetchGroups().then((response) => {
      const filteredByPublic = response.filter((el) => el.is_public);
      setGroups(filteredByPublic);
    });
    fetchMyGroups();
    if (token) {
      fetchFriends(getUserId()!).then(setFriends);
      fetchAssignations().then(setAssignations);
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
      <div className="container-fluid bg-warning pb-4">
        <h1 className="py-3  flex flex-column align-content-center text-center">
          Benvingut a Metari
        </h1>
        {token && (
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
        )}
      </div>


      <div className="container-fluid">
        <div className="row ">


          <div className="row mt-3">
            <div className="col-12 col-md-3">
              <CategoryList
                categories={categories}
                setter={setCategories}
                filteredCategory={filteredCategory}
                setFilteredCategory={setFilteredCategory}
              />
            </div>
            <div className="col-12 pt-4 col-md">
              <SearchBar></SearchBar>
              <MetaList
                metas={metas}
                setter={setMetas}
                filteredCategory={filteredCategory}
                groups={groups}
              />
              {/* <MyMetaList assignations={assignations}/> */}
            </div>
            <div className="col-12 col-md-3">
              <FriendList users={friends} setter={setFriends} />
              <MyGroupsList groups={myGroups} setter={setMyGroups} />
              <UserList users={users} setter={setUsers} isTop10={true} />
              <GroupList groups={groups} setter={setGroups} isTop10={true} />
            </div>
          </div>
        </div>
      </div>

      {/* {groupModeratorPanel && (
        <ModalGroupModeratorPanel
          group={groupModeratorPanel}
          setEditGroup={setGroupModeratorPanel}
          setter={setGroups}
        />
      )} */}
    </>
  );
}
