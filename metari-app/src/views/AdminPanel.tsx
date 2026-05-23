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

import { Helmet } from "react-helmet-async";

export default function AdminPanel() {

  const navigate = useNavigate();

  const [menuSelection, setMenuSelection] = useState<string>("metas")
  const [categories, setCategories] = useState<categoryType[]>([])
  const [metas, setMetas] = useState<metaType[]>([])
  const [users, setUsers] = useState<userTypeFrontend[]>([])
  const [groups, setGroups] = useState<groupType[]>([])
  const [indexedMetas, setIndexedMetas] = useState<indexedType[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {})
    fetchMetas().then(setMetas).catch(() => {})
    fetchUsers().then(setUsers).catch(() => {})
    fetchGroups().then(setGroups).catch(() => {})
    fetchIndexedMetas().then((response) => {
      setIndexedMetas(response.filter((el) => el.meta.is_public === true));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    fetchMetas().then(setMetas).catch(() => {})
  }, [indexedMetas.length]);

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

  const q = searchTerm.toLowerCase()
  const filteredMetas = metas.filter(m =>
    m.title.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q)
  )
  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)
  )
  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(q) ||
    u.name.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q)
  )
  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(q) || g.description?.toLowerCase().includes(q)
  )

  return (
    <>
      <Helmet>
        <title>Metari · Admin</title>
      </Helmet>
      <div className="container-fluid banner pb-4 pt-3">
        <h1 className="py-3 titol flex flex-column align-content-center text-center">
          Metari
        </h1>
        <h2 className="text-center text-muted ">Gestiona i supervisa la plataforma.</h2>

      </div>
      <h2 className="text-center mt-4">Panell Admin</h2>
      <div className="selectionMenu mt-4 d-flex justify-content-center gap-3">
        <div
          className="btn createBtnWhite"
          onClick={() => setMenuSelection("metas")}
        >
          Metas
        </div>
        <div
          className="btn createBtnWhite"
          onClick={() => setMenuSelection("categories")}
        >
          Categories
        </div>
        <div
          className="btn createBtnWhite"
          onClick={() => setMenuSelection("usuaris")}
        >
          Usuaris
        </div>
        <div
          className="btn createBtnWhite"
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

      <div className="container">
        <div className="row justify-content-center mb-5">
          {/* <div className="col-3"></div> */}
          <div className="col-12 col-lg-8">
            <div className="input-group my-3">
              <span className="input-group-text"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Cerca..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
           
            {menuSelection === "metas" && (
              <>
                <MetaList metas={filteredMetas} setter={setMetas} groups={groups}/>
                <PendingIndexedMetas indexedMetas={indexedMetas} setIndexedMetas={setIndexedMetas} />
              </>
            )}
            {menuSelection === "categories" && <CategoryList categories={filteredCategories} setter={setCategories} />}
            {menuSelection === "usuaris" && <UserList users={filteredUsers} setter={setUsers} />}
            {menuSelection === "grups" && <GroupList groups={filteredGroups} setter={setGroups} />}
          </div>
          
        </div>
      </div>
    </>
  );
}
