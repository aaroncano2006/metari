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