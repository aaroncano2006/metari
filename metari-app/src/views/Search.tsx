import { useEffect, useState } from "react";
import { fetchCategories } from "../services/categoryService";
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
import { Helmet } from "react-helmet-async";
import { search } from "../services/searchService";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";

export default function Search() {
  const [users, setUsers] = useState<userTypeFrontend[]>([]);
  const [categories, setCategories] = useState<categoryType[]>([]);
  const [groups, setGroups] = useState<groupType[]>([]);
  const [myGroups, setMyGroups] = useState<groupType[]>([]);
  const [friends, setFriends] = useState<userTypeFrontend[]>([]);
  const [_assignations, setAssignations] = useState<assignationType[]>([]);

  const [foundUsers, setFoundUsers] = useState<userTypeFrontend[]>([]);
  const [foundMetas, setFoundMetas] = useState<metaType[]>([]);
  const [foundGroups, setFoundGroups] = useState<groupType[]>([]);

  const [list, setList] = useState<"metas" | "users" | "groups">("metas");

  const token = localStorage.getItem("token");

  const [filteredCategory, setFilteredCategory] = useState<number | null>(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const word = searchParams.get("q");

  const fetchMyGroups = () => {
    fetchGroups().then((response) => {
      const filteredByPublic = response.filter(
        (el) =>
          el.owner_id === getUserId() ||
          el.groupUsers.some((gu) => gu.user_id === getUserId()),
      );
      setMyGroups(filteredByPublic);
    }).catch(() => {});
  };

  useEffect(() => {
    fetchUsers().then(setUsers).catch(() => {});
    fetchCategories().then(setCategories).catch(() => {});
    fetchGroups().then(setGroups).catch(() => {});
    fetchMyGroups();

    if (token) {
      fetchFriends(getUserId()!).then(setFriends).catch(() => {});
      fetchAssignations().then(setAssignations).catch(() => {});
    }

    if (!word?.trim()) {
      navigate("/");
    }

    search(word).then((response) => {
      setFoundUsers(response.users);
    });

    search(word).then((response) => {
      setFoundMetas(response.metas);
    });

    search(word).then((response) => {
      setFoundGroups(response.groups);
    });
  }, [word]);

  useEffect(() => {
    window.addEventListener("buttonChange", fetchMyGroups);
    return () => window.removeEventListener("buttonChange", fetchMyGroups);
  }, []);

  return (
    <>
      <Helmet>
        <title>{`Metari · Resultats de cerca per a: "${word}"`}</title>
      </Helmet>

      <h1 className="p-5">{`Resultats de cerca per a: "${word}"`}</h1>

      <div className="row mb-5 d-flex justify-content-center">
        <div className="col-6">
          <SearchBar></SearchBar>
        </div>
      </div>

      <div className="row-sm gap-3 d-flex justify-content-center">
          <button className="btn btn-primary" onClick={() => setList("metas")}>Metas</button>
          <button className="btn btn-primary" onClick={() => setList("users")}>Usuaris</button>
          <button className="btn btn-primary" onClick={() => setList("groups")}>Grups</button>
      </div>

      <div className="container-fluid">
        <div className="row mt-5">
          <div className="col-12 col-md-3">
            <CategoryList
              categories={categories}
              setter={setCategories}
              filteredCategory={filteredCategory}
              setFilteredCategory={setFilteredCategory}
            />
          </div>
          <div className="col-12 col-md">
            {list === "metas" && (
              <MetaList
                metas={foundMetas}
                setter={setFoundMetas}
                filteredCategory={filteredCategory}
                groups={groups}
              />
            )}
            {list === "users" && (
              <UserList users={foundUsers} setter={setFoundUsers} />
            )}
            {list === "groups" && (
              <GroupList groups={foundGroups} setter={setFoundGroups} />
            )}
            {/* <MyMetaList assignations={assignations}/> */}
          </div>
          <div className="col-12 col-md-3">
            <FriendList users={friends} setter={setFriends} />
            <MyGroupsList groups={myGroups} setter={setMyGroups} />
            <UserList users={users} setter={setUsers} isTop10={true}/>
            <GroupList groups={groups} setter={setGroups} isTop10={true}/>
          </div>
        </div>
      </div>
    </>
  );
}
