import { axiosConnection } from "./axiosConnection"
// import { useEffect, useState } from "react"
import type { assignationType } from "../types/assignationType"





export async function fetchAssignations(): Promise<assignationType[]> {
  const { data } = await axiosConnection.get<assignationType[]>("/assignacions")
  return data
}


export async function createAssignation(newAssignation: Partial<assignationType>): Promise<assignationType> {
  try {
    const { data } = await axiosConnection.post<assignationType>(`/assignacions`, newAssignation);
    return data;
    
  } catch (error) {
    console.error("Error creant assignacio:", error);
    throw error;
  }

}