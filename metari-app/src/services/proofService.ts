import { axiosConnection } from "./axiosConnection"
import type { proofType } from "../types/proofType"



export async function createProof(data: Partial<proofType>): Promise<proofType> {
  const { data: response } = await axiosConnection.post<proofType>("/proves", data)
  return response
}


export async function createProofWithFile(data: FormData): Promise<proofType> {
  const { data: response } = await axiosConnection.post<proofType>("/proves", data)
  return response
}

export async function updateProof(id: number, data: Partial<proofType>): Promise<proofType> {
    const { data: response } = await axiosConnection.put<proofType>(`/proves/${id}`, data)
    return response
}

export async function updateProofWithFile(id: number, data: FormData): Promise<proofType> {
    const { data: response } = await axiosConnection.put<proofType>(`/proves/${id}`, data)
    return response
}

export async function deleteProof(id: number): Promise<void> {
  await axiosConnection.delete(`/proves/${id}`)
}