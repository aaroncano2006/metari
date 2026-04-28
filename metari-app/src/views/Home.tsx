import { useEffect, useState } from "react"
// import { fetchCategories } from "../services/categoryService"
// import { fetchMetas, useMetas } from "../services/metaService"
import { UserList } from "../components/UserList"
import { MetaList } from "../components/MetaList"
import { CategoryList } from "../components/CategoryList"
// import { fetchUsers } from "../services/userService"
// import type { userTypeFrontend } from "../types/userTypeFrontend"
// import { allUsers } from "../hooks/useUsers"
import { useUsers } from "../services/userService"
import type { categoryType } from "../types/categoryType"
import type { metaType } from "../types/metaType"
import { useMetas } from "../services/metaService"
import { useCategories } from "../services/categoryService"


export default function Home() {
  // const [users, setUsers] = useState<userTypeFrontend[]>([])
  const users = useUsers()
  const metas = useMetas()
  const categories = useCategories()
  
  // const [metas, setMetas] = useState<metaType[]>([])

  useEffect(() => {
    // fetchUsers().then(setUsers)
    // fetchCategories().then(setCategories)
    // fetchMetas().then(setMetas)

  }, [])

  return (
    <>
      <h1 className="banner bg-warning flex flex-column align-content-center text-center">Benvingut a Metari</h1>
       <div className="container-fluid">
        <div className="row mt-5">
          
          <div className="col-3">
            <CategoryList categories={categories} />
          </div>
          <div className="col">
            <MetaList metas={metas} />
          </div>
          <div className="col-3">
            <UserList users={users} />
          </div>
        </div>
      </div>
      
    </>
  )
}