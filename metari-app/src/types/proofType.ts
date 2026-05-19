export type proofType = {
  id: number
  assignation_id: number
  user_id?: number | null
  proof: string
  proof_type: string
  is_valid: boolean
  created_at: string
  user?: { id: number; name: string } | null
}