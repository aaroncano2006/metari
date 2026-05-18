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

export async function updateAssignation(id: number, data: Partial<assignationType>): Promise<assignationType> {
  const { data: response } = await axiosConnection.put<assignationType>(`/assignacions/${id}`, data);
  return response;
}


export async function deleteAssignation(id: number): Promise<void> {
  try {
    await axiosConnection.delete(`/assignacions/${id}`);
  } catch (error) {
    console.error("Error eliminant assignació:", error);
    throw error;
  }
}