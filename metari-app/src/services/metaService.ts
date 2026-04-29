import { axiosConnection } from "./axiosConnection"
import type { metaType } from "../types/metaType"

export async function fetchMetas(): Promise<metaType[]> {
  const { data } = await axiosConnection.get<metaType[]>("/metas");

  return data;
}