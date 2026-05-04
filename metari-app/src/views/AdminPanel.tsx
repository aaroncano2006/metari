//llibreries
import { useEffect, useState } from "react"

//services 
import { fetchCategories } from "../services/categoryService"
import { fetchMetas } from "../services/metaService"
import { fetchUsers } from "../services/userService";

//components
import { CreateBtn } from "../components/Buttons/CreateBtn";
import { MetaList } from "../components/MetaList"
import { CategoryList } from "../components/CategoryList";
import { UserList } from "../components/UserList";

//types
import type { categoryType } from "../types/categoryType"
import type { metaType } from "../types/metaType";
import type { userTypeFrontend } from "../types/userTypeFrontend";


export default function AdminPanel() {

  const [menuSelection, setMenuSelection] = useState<string>("metas")
  const [categories, setCategories] = useState<categoryType[]>([])
  const [metas, setMetas] = useState<metaType[]>([])
  const [users, setUsers] = useState<userTypeFrontend[]>([])

  useEffect(() => {
    fetchCategories().then(setCategories)
    fetchMetas().then(setMetas)
    fetchUsers().then(setUsers)

  }, [])

  //need to refactor again
  // const metas = useMetas();


  return (
    <>
      <h1>Panell Admin</h1>
      <div className="selectionMenu mt-5 d-flex justify-content-center gap-3">
        <div className="btn btn-primary"
          onClick={() => setMenuSelection("metas")}>Metas</div>
        <div className="btn btn-primary"
          onClick={() => setMenuSelection("categories")}>Categories</div>
        <div className="btn btn-primary"
          onClick={() => setMenuSelection("usuaris")}>Usuaris</div>
        <div className="btn btn-primary"
          onClick={() => setMenuSelection("grups")}>Grups</div>
      </div>

      <div className="createBtn mt-4 text-center">
        {(menuSelection === "metas" || menuSelection === "categories") && (
          <CreateBtn menuSelection={menuSelection} />
        )}
      </div>

      <div className="container-fluid">
        <div className="row mt-4">

          <div className="col-3">

          </div>
          <div className="col-6">
            {menuSelection === "metas" && <MetaList metas={metas} setter={setMetas}/>}
            {menuSelection === "categories" && <CategoryList categories={categories} setter={setCategories} />}
            {menuSelection === "usuaris" && <UserList users={users} setter={setUsers} />}
          </div>
          <div className="col-3">
          </div>
        </div>
      </div>

    </>
  )
}