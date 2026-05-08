import { axiosConnection } from "./axiosConnection"
// import { useEffect, useState } from "react"
import type { assignationType } from "../types/assignationType"





export async function fetchAssignations(): Promise<assignationType[]> {
  const { data } = await axiosConnection.get<assignationType[]>("/assignacions")
  return data
}
