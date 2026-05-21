import { useEffect, useState } from "react"
import { fetchCategories } from "../services/categoryService"
import { fetchMetas } from "../services/metaService"
import { UserList } from "../components/UserList"
import { MetaList } from "../components/MetaList"
import { CategoryList } from "../components/CategoryList"
import { GroupList } from "../components/GroupList"
import { MyGroupsList } from "../components/MyGroupsList"
import { MyMetaList } from "../components/MyMetaList"
import { FriendList } from "../components/FriendList"
import { fetchUsers } from "../services/userService"
import type { userTypeFrontend } from "../types/userTypeFrontend"
import type { categoryType } from "../types/categoryType"
import type { groupType } from "../types/groupType"
import type { metaType } from "../types/metaType"
import { fetchGroups } from "../services/groupService"
import { getUserId } from "../services/auth/loginService"
import { fetchFriends } from "../services/invitationService";
import { fetchAssignations } from "../services/assignationService"
import type { assignationType } from "../types/assignationType"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"

// import { useMetas } from "../services/metaService"
// import { useCategories } from "../services/categoryService"



export default function MyMetas() {
  const [users, setUsers] = useState<userTypeFrontend[]>([])
  const [metas, setMetas] = useState<metaType[]>([])
  const [categories, setCategories] = useState<categoryType[]>([])
  const [groups, setGroups] = useState<groupType[]>([])
  const [myGroups, setMyGroups] = useState<groupType[]>([])
  const [friends, setFriends] = useState<userTypeFrontend[]>([])
  const [assignations, setAssignations] = useState<assignationType[]>([])


  const [filteredCategory, setFilteredCategory] = useState<number | null>(null)

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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
    fetchUsers().then(setUsers).catch(() => {})
    fetchCategories().then(setCategories).catch(() => {})
    fetchMetas().then(setMetas).catch(() => {})
    fetchGroups().then((response) => {
      const filteredByPublic = response.filter((el) => el.is_public);
      setGroups(filteredByPublic);
    }).catch(() => {});
    fetchMyGroups();
    fetchFriends(getUserId()!).then(setFriends).catch(() => {})
    fetchAssignations().then(setAssignations).catch(() => {})

  }, [])

  useEffect(() => {
    window.addEventListener("buttonChange", fetchMyGroups);
    return () => window.removeEventListener("buttonChange", fetchMyGroups);
  }, []);

  if (!token) {
    navigate("/login");
  }

  return (
    <>
      <Helmet>
        <title>Metari · Les meves metes</title>
      </Helmet>

      <h1 className="banner bg-warning flex flex-column align-content-center text-center">Benvingut a Metari</h1>
      <div className="container-fluid">


        <div className="row mt-5">

          <div className="d-none d-md-block col-12 col-sm-5 col-md-4 col-xl-3">
            <CategoryList 
            categories={categories} 
            setter={setCategories} 
            filteredCategory={filteredCategory}
            setFilteredCategory={setFilteredCategory}
            />
          </div>


          <div className="col-12  col-md-8 col-xl-6">
            <MyMetaList assignations={assignations} setAssignations={setAssignations}/>
          </div>


          <div className="col-12 col-xl-3">
            <div className="row g-2">

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
  )
}