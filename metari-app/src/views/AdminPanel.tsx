import { MetaList } from "../components/MetaList"
import { useState } from "react"
import { useMetas } from "../services/metaService"
import { useCategories } from "../services/categoryService"
import { CategoryList } from "../components/CategoryList";

export default function AdminPanel() {


  //posar useffect aqui i passar a usemetas metas i setmetas al service?
  const metas = useMetas();
  const categories = useCategories();

  const [menuSelection, setMenuSelection] = useState<string>("metas")

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
      <div className="container-fluid">
        <div className="row mt-4">

          <div className="col-3">
            
          </div>
          <div className="col-6">
            {menuSelection === "metas" && <MetaList metas={metas} />}
            {menuSelection === "categories" && <CategoryList categories={categories}/>}
          </div>
          <div className="col-3">
          </div>
        </div>
      </div>

    </>
  )
}