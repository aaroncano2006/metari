import { axiosConnection } from "./axiosConnection"
import type { categoryType } from "../types/categoryType"
import { useEffect, useState } from "react"



export function useCategories() {
  const [category, setCategory] = useState<categoryType[]>([])

  useEffect(() => {
    async function load() {
      const { data } = await axiosConnection.get<categoryType[]>("/categories")
      setCategory(data)
    }

    load()
  }, [])

  return category
}

