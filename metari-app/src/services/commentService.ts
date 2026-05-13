import { axiosConnection } from "./axiosConnection"
// import { useEffect, useState } from "react"
import type { commentType } from "../types/commentType";




export async function fetchComments(): Promise<commentType[]> {
  const { data } = await axiosConnection.get<commentType[]>("/comentaris")
  return data
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