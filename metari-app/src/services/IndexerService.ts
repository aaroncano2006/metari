import { axiosConnection } from "./axiosConnection"
import type { categoryType } from "../types/categoryType"
// import { useEffect, useState } from "react"
import type { indexedType } from "../types/indexedType"




export async function fetchIndexedMetas(): Promise<indexedType[]> {
  const { data } = await axiosConnection.get<indexedType[]>("/indexa-metas")
  return data
}


// export async function fetchCategoryById(id: number): Promise<categoryType> {
//   const { data } = await axiosConnection.get<categoryType>(`/categories/${id}`);
//   return data;
// }

export async function createIndexedMeta(newIndex: Partial<indexedType>): Promise<indexedType> {
  try {
    const { data } = await axiosConnection.post<indexedType>(`/indexa-metas`, newIndex);
    return data;
    
  } catch (error) {
    console.error("Error creant Indexacio:", error);
    throw error;
  }

}

// export async function updateCategory(id: number, updatedData: Partial<categoryType>): Promise<categoryType> {
//   try {
//     const { data } = await axiosConnection.put<categoryType>(`/categories/${id}`, updatedData)
//     return data

//   } catch (error) {
//     console.error("Error actualitzant Categoria:", error)
//     throw error
//   }
// }

// export async function deleteCategory(id: number): Promise<void> {
//   try {
//     await axiosConnection.delete(`/categories/${id}`);
//   } catch (error) {
//     console.error("Error eliminant categoria:", error);
//   }
  
// }