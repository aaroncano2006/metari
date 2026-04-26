import type { categoryType } from "../types/categoryType"


type CategoryListProps = {
  categories: categoryType[]
}

export function CategoryList({ categories }: CategoryListProps){

    return (
    <>

     <div className="userList ">
      <div className="titolComponent text-center">Categories</div>
      <hr className="my-2" />
              <ul className="ps-4">
                {categories.map((category) => (
                  <li key={category.id}  className="listEntry ">
                    {category.name}                    
                  </li>
                ))}
              </ul>

            </div>
    </>
  );
}