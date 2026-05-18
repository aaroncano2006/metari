import { axiosConnection } from "./axiosConnection"
// import { useEffect, useState } from "react"
import type { commentType } from "../types/commentType";




export async function fetchComments(): Promise<commentType[]> {
  const { data } = await axiosConnection.get<commentType[]>("/comentaris")
  return data
}
export async function fetchCommentById(id: number): Promise<commentType> {
  const { data } = await axiosConnection.get<commentType>(`/comentaris/${id}`);
  return data;
}


export async function createComment(newComment: Partial<commentType>): Promise<commentType> {
  try {
    const { data } = await axiosConnection.post<commentType>(`/comentaris`, newComment);
    return data;
    
  } catch (error) {
    console.error("Error creant assignacio:", error);
    throw error;
  }

}



export async function updateComment(id: number, updatedData: Partial<commentType>): Promise<commentType> {
  try {
    const { data } = await axiosConnection.put<commentType>(`/comentaris/${id}`, updatedData)
    return data

  } catch (error) {
    console.error("Error actualitzant el comentari:", error)
    throw error
  }
}

export async function deleteComment(id: number): Promise<void> {
  try {
    await axiosConnection.delete(`/comentaris/${id}`);
  } catch (error) {
    console.error("Error eliminant comentari:", error);
  }
  
}