import { useEffect, useState } from "react"
import { fetchCategories } from "../services/categoryService"
import { fetchMetas } from "../services/metaService"
import { UserList } from "../components/UserList"
import { MetaList } from "../components/MetaList"
import { CategoryList } from "../components/CategoryList"
import { GroupList } from "../components/GroupList"
import { MyGroupsList } from "../components/MyGroupsList"
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
import SearchBar from "../components/SearchBar"

// import { useMetas } from "../services/metaService"
// import { useCategories } from "../services/categoryService"



export default function Home() {
  const [users, setUsers] = useState<userTypeFrontend[]>([])
  const [metas, setMetas] = useState<metaType[]>([])
  const [categories, setCategories] = useState<categoryType[]>([])
  const [groups, setGroups] = useState<groupType[]>([])
  const [friends, setFriends] = useState<userTypeFrontend[]>([])
  const [_assignations, setAssignations] = useState<assignationType[]>([])

  const token = localStorage.getItem("token");

  const [filteredCategory, setFilteredCategory] = useState<number | null>(null)


  useEffect(() => {
    fetchUsers().then(setUsers)
    fetchCategories().then(setCategories)
    fetchMetas().then(setMetas)
    // fetchMetas().then((response) => {
    //   const filteredByPublic = response.filter((el) => el.is_public);
    //   setMetas(filteredByPublic);
    // });
    fetchGroups().then((response) => {
      const filteredByPublic = response.filter((el) => el.is_public);
      setGroups(filteredByPublic);
    });
    if (token) {
      fetchFriends(getUserId()!).then(setFriends)
      fetchAssignations().then(setAssignations)
    }

  }, [])

  return (
    <>
      <Helmet>
        <title>Metari · Home - Comunitats, objectius i connexions</title>
      </Helmet>

      <h1 className="banner bg-warning flex flex-column align-content-center text-center">Benvingut a Metari</h1>
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
          <div className="col-12 pt-4 col-md">
            <SearchBar></SearchBar>
            <MetaList metas={metas} setter={setMetas} filteredCategory={filteredCategory} groups={groups}/>
            {/* <MyMetaList assignations={assignations}/> */}
          </div>
          <div className="col-12 col-md-3">
            <FriendList users={friends} setter={setFriends} />
            <MyGroupsList groups={groups} />
            <UserList users={users} setter={setUsers} isTop10={true}/>
            <GroupList groups={groups} setter={setGroups} isTop10={true}/>
          </div>
        </div>
      </div>

    </>
  )
}