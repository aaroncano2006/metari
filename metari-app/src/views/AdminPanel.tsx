//llibreries
import { useEffect, useState } from "react"

//services 
import { fetchCategories } from "../services/categoryService"
import { fetchMetas } from "../services/metaService"
import { fetchUsers } from "../services/userService";
import { fetchGroups } from "../services/groupService";
import { fetchIndexedMetas } from "../services/IndexerService"

//components
import { CreateBtn } from "../components/Buttons/CreateBtn";
import { MetaList } from "../components/MetaList"
import { CategoryList } from "../components/CategoryList";
import { UserList } from "../components/UserList";
import { GroupList } from "../components/GroupList";
import { PendingIndexedMetas } from "../components/PendingIndexedMetas"

//types
import type { categoryType } from "../types/categoryType"
import type { metaType } from "../types/metaType";
import type { userTypeFrontend } from "../types/userTypeFrontend";
import type { groupType } from "../types/groupType";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../services/auth/loginService";
import type { indexedType } from "../types/indexedType";

export default function AdminPanel() {

  const navigate = useNavigate();

  const [menuSelection, setMenuSelection] = useState<string>("metas")
  const [categories, setCategories] = useState<categoryType[]>([])
  const [metas, setMetas] = useState<metaType[]>([])
  const [users, setUsers] = useState<userTypeFrontend[]>([])
  const [groups, setGroups] = useState<groupType[]>([])
  const [indexedMetas, setIndexedMetas] = useState<indexedType[]>([])

  useEffect(() => {
    fetchCategories().then(setCategories)
    fetchMetas().then(setMetas)
    fetchUsers().then(setUsers)
    fetchGroups().then(setGroups)
    fetchIndexedMetas().then(setIndexedMetas)

    //useEffect(() => {
    //fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }

    const userRole = getUserRole();

    if (!userRole || userRole !== "admin") {
      navigate("/");
    }
  }, []);

  //need to refactor again
  // const metas = useMetas();

  return (
    <>
      <h1 className="text-center mt-4">Panell Admin</h1>
      <div className="selectionMenu mt-4 d-flex justify-content-center gap-3">
        <div
          className="btn btn-primary"
          onClick={() => setMenuSelection("metas")}
        >
          Metas
        </div>
        <div
          className="btn btn-primary"
          onClick={() => setMenuSelection("categories")}
        >
          Categories
        </div>
        <div
          className="btn btn-primary"
          onClick={() => setMenuSelection("usuaris")}
        >
          Usuaris
        </div>
        <div
          className="btn btn-primary"
          onClick={() => setMenuSelection("grups")}
        >
          Grups
        </div>
      </div>

      <div className="createBtn mt-4 text-center">
        {menuSelection === "metas" && (
          <CreateBtn menuSelection={menuSelection} setter={setMetas} />
        )}
        {menuSelection === "categories" && (
          <CreateBtn menuSelection={menuSelection} setter={setCategories} />
        )}
      </div>

      <div className="container-fluid">
        <div className="row">
          <div className="col-3"></div>
          <div className="col-6">
            {menuSelection === "metas" && (
              <>
                <MetaList metas={metas} setter={setMetas} groups={groups} />
                <PendingIndexedMetas indexedMetas={indexedMetas} setIndexedMetas={setIndexedMetas} />
              </>
            )
            }
            {menuSelection === "categories" && <CategoryList categories={categories} setter={setCategories} />}
            {menuSelection === "usuaris" && <UserList users={users} setter={setUsers} />}
            {menuSelection === "grups" && <GroupList groups={groups} setter={setGroups} />}
          </div>
          <div className="col-3">
          </div>
          <div className="col-3"></div>
        </div>
      </div>
    </>
  );
}
