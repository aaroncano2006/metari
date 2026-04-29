import { axiosConnection } from "./axiosConnection"
import type { categoryType } from "../types/categoryType"
import { useEffect, useState } from "react"



export function useCategories() {
  const [categories, setCategories] = useState<categoryType[]>([])

  useEffect(() => {
    async function load() {
      const { data } = await axiosConnection.get<categoryType[]>("/categories")
      setCategories(data)
    }

    load()
  }, [])

  return categories
}

export async function fetchCategoryById(id: number): Promise<categoryType> {
  const { data } = await axiosConnection.get<categoryType>(`/categories/${id}`);
  return data;
}

export async function createCategory(newCategory: Partial<categoryType>): Promise<categoryType> {
  try {
    const { data } = await axiosConnection.post<categoryType>(`/categories`, newCategory);
    return data;
    
  } catch (error) {
    console.error("Error creant Categoria:", error);
    throw error;
  }

}

export async function updateCategory(id: number, updatedData: Partial<categoryType>): Promise<categoryType> {
  try {
    const { data } = await axiosConnection.put<categoryType>(`/categories/${id}`, updatedData)
    return data

  } catch (error) {
    console.error("Error actualitzant Categoria:", error)
    throw error
  }
}

export async function deleteCategory(id: number): Promise<void> {
  try {
    await axiosConnection.delete(`/categories/${id}`);
  } catch (error) {
    console.error("Error eliminant categoria:", error);
  }
  
}