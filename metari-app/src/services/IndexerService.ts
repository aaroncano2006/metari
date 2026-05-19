import { axiosConnection } from "./axiosConnection"
import type { categoryType } from "../types/categoryType"
// import { useEffect, useState } from "react"
import type { indexedType } from "../types/indexedType"




export async function fetchIndexedMetas(): Promise<indexedType[]> {
  const { data } = await axiosConnection.get<indexedType[]>("/indexa-metas")
  return data
}


export async function createIndexedMeta(newIndex: Partial<indexedType>): Promise<indexedType> {
  try {
    const { data } = await axiosConnection.post<indexedType>(`/indexa-metas`, newIndex);
    return data;
    
  } catch (error) {
    console.error("Error creant Indexacio:", error);
    throw error;
  }

}

export async function updateIndexedMeta(id: number, data: Partial<indexedType>): Promise<indexedType> {
  const { data: response } = await axiosConnection.put<indexedType>(`/indexa-metas/${id}`, data);
  return response;
}

export async function deleteIndexedMeta(id: number): Promise<void> {
  await axiosConnection.delete(`/indexa-metas/${id}`);
}
