import { MetaList } from "../components/MetaList"
import { fetchMetas } from "../services/metaService"
import { useEffect, useState } from "react"
import type { metaType } from "../types/metaType"





export default function AdminPanel() {

    const [metas, setMetas] = useState<metaType[]>([])
  
    useEffect(() => {
        fetchMetas().then(setMetas)
    
      }, [])
  return(
    <>
     <h1>Panell Admin</h1>
            
           <div className="container-fluid">
            <div className="row mt-5">
              
              <div className="col-3">
              </div>
              <div className="col">
                <MetaList metas={metas} />
              </div>
              <div className="col-3">
              </div>
            </div>
          </div>
          
        </>
    )
}