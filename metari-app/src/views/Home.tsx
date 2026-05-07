import { useEffect, useState } from "react"
import { fetchCategories } from "../services/categoryService"
import { fetchMetas } from "../services/metaService"
import { UserList } from "../components/UserList"
import { MetaList } from "../components/MetaList"
import { CategoryList } from "../components/CategoryList"
import { GroupList } from "../components/GroupList"
import { FriendList } from "../components/FriendList"
import { fetchUsers } from "../services/userService"
import type { userTypeFrontend } from "../types/userTypeFrontend"
import type { categoryType } from "../types/categoryType"
import type { groupType } from "../types/groupType"
import type { metaType } from "../types/metaType"
import { fetchGroups } from "../services/groupService"
import { getUserId } from "../services/auth/loginService"
import { fetchFriends } from "../services/invitationService";

// import { useMetas } from "../services/metaService"
// import { useCategories } from "../services/categoryService"



export default function Home() {
  const [users, setUsers] = useState<userTypeFrontend[]>([])
  const [metas, setMetas] = useState<metaType[]>([])
  const [categories, setCategories] = useState<categoryType[]>([])
  const [groups, setGroups] = useState<groupType[]>([])
  const [friends, setFriends] = useState<userTypeFrontend[]>([])


  const [filteredCategory, setFilteredCategory] = useState<number | null>(null)


  useEffect(() => {
    fetchUsers().then(setUsers)
    fetchCategories().then(setCategories)
    fetchMetas().then(setMetas)
    fetchGroups().then(setGroups)
    fetchFriends(getUserId()!).then(setFriends)

  }, [])

  return (
    <>
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
          <div className="col-12 col-md">
            <MetaList metas={metas} setter={setMetas} filteredCategory={filteredCategory}/>
          </div>
          <div className="col-12 col-md-3">
            <FriendList users={friends} setter={setFriends} />
            <UserList users={users} setter={setUsers} />
            <GroupList groups={groups} setter={setGroups} />
          </div>
        </div>
      </div>

    </>
  )
}