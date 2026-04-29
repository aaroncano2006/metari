import { axiosConnection } from "./axiosConnection"
import type { categoryType } from "../types/categoryType"

export async function fetchCategories(): Promise<categoryType[]> {
  const { data } = await axiosConnection.get<categoryType[]>("/categories");

  return data;
}