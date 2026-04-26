import type { metaType } from "../types/metaType";


type MetaListProps = {
  metas: metaType[]
}

export function MetaList({ metas }: MetaListProps){

    return (
    <>

     <div className="userList ">
      <div className="titolComponent text-center">Metas</div>
      <hr className="my-2" />
              <ul>
                {metas.map((meta) => (
                  <li key={meta.id}  className="listEntry">
                    {meta.title}                    
                  </li>
                ))}
              </ul>

            </div>
    </>
  );
}