import { axiosConnection } from "./axiosConnection"
import { useEffect, useState } from "react"

import type { metaType } from "../types/metaType"

export async function fetchMetas(): Promise<metaType[]> {
  const { data } = await axiosConnection.get<metaType[]>("/metas");

  return data;
}

// export function useMetas() {
//   const [metas, setMetas] = useState<metaType[]>([])

//   useEffect(() => {
//     async function load() {
//       const { data } = await axiosConnection.get<metaType[]>("/metas")
//       setMetas(data)
//     }

//     load()
//   }, [])

//   return metas
// }

export async function fetchMetaById(id: number): Promise<metaType> {
  const { data } = await axiosConnection.get<metaType>(`/metas/${id}`);
  return data;
}

export async function createMeta(newMeta: Partial<metaType>): Promise<metaType> {
  try {
    const { data } = await axiosConnection.post<metaType>(`/metas`, newMeta);
    return data;
    
  } catch (error) {
    console.error("Error creant meta:", error);
    throw error;
  }

}

export async function updateMeta(id: number, updatedData: Partial<metaType>): Promise<metaType> {
  try {
    const { data } = await axiosConnection.put<metaType>(`/metas/${id}`, updatedData)
    return data

  } catch (error) {
    console.error("Error actualitzant meta:", error)
    throw error
  }
}

export async function deleteMeta(id: number): Promise<void> {
  try {
    await axiosConnection.delete(`/metas/${id}`);
  } catch (error) {
    console.error("Error eliminant meta:", error);
  }
  
}