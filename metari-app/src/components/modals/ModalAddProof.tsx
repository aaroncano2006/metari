import { useEffect, useState } from "react"
import type { assignationType } from "../../types/assignationType"
import { getUserId } from "../../services/auth/loginService"
import { createProof, createProofWithFile, updateProof, updateProofWithFile } from "../../services/proofService"
import { proofSchema } from "../../schemas/proofSchema"
import type { proofType } from "../../types/proofType"

type ModalProps = {
  assignation: assignationType
  assignationSetter: React.Dispatch<React.SetStateAction<assignationType | null>>
  setAssignations: React.Dispatch<React.SetStateAction<assignationType[]>>
  existingProof?: proofType
}


export function ModalAddProof({ assignation, assignationSetter, setAssignations, existingProof }: ModalProps) {
  const [proofType, setProofType] = useState<"text" | "image">("text")
  const [proofText, setProofText] = useState("")
  const [proofImage, setProofImage] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (existingProof) {
      setProofType(existingProof.proof_type as "text" | "image")
      if (existingProof.proof_type === "text") {
        setProofText(existingProof.proof)
      }
    }
  }, [existingProof])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setErrors({})
    const userId = getUserId()

    if (proofType === "text") {
      const data = {
        assignation_id: assignation.id,
        user_id: userId,
        proof: proofText,
        proof_type: "text" as const,
        is_valid: false,
      }
      const validation = proofSchema.safeParse(data)
      if (!validation.success) {
        const fieldErrors: Record<string, string> = {}
        validation.error.issues.forEach((issue) => {
          const field = issue.path[0] as string
          fieldErrors[field] = issue.message
        })
        setErrors(fieldErrors)
        return
      }
      setErrors({})
      try {
        if (existingProof) {
          const proof = await updateProof(existingProof.id, validation.data)
          setAssignations(prev => prev.map(a =>
            a.id === proof.assignation_id
              ? { ...a, proofs: a.proofs?.map(p => p.id === proof.id ? proof : p) ?? [proof] }
              : a
          ))
        } else {
          const proof = await createProof(validation.data)
          setAssignations(prev => prev.map(a =>
            a.id === proof.assignation_id
              ? { ...a, proofs: [...(a.proofs ?? []), proof] }
              : a
          ))
        }
        assignationSetter(null)
        alert("Prova enviada correctament")
      } catch (error) {
        alert("Error en enviar la prova")
      }
    }

    if (proofType === "image") {
      if (!proofImage) {
        setErrors({ proofImage: "Selecciona una imatge" })
        return
      }

      const formData = new FormData()
      formData.append("assignation_id", String(assignation.id))
      formData.append("user_id", String(userId))
      formData.append("proof_type", "image")
      formData.append("is_valid", "false")
      formData.append("proofImage", proofImage)
      try {
        if (existingProof) {
          const proof = await updateProofWithFile(existingProof.id, formData)
          setAssignations(prev => prev.map(a =>
            a.id === proof.assignation_id
              ? { ...a, proofs: a.proofs?.map(p => p.id === proof.id ? proof : p) ?? [proof] }
              : a
          ))
        } else {
          const proof = await createProofWithFile(formData)
          setAssignations(prev => prev.map(a =>
            a.id === proof.assignation_id
              ? { ...a, proofs: [...(a.proofs ?? []), proof] }
              : a
          ))
        }
        assignationSetter(null)
        alert("Prova enviada correctament")
      } catch (error) {
        alert("Error en enviar la prova")
      }
    }
  }


  return (
    <div className="modalOverlay h-100 w-100">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-8 col-md-6 col-xl-4">
            <div className="modalWindow p-4">
              <h5 className="tiltWarp">Envia una prova</h5>
              <form onSubmit={handleSubmit}>
                <label><strong>Tipus de prova:</strong></label>
                <div className="d-flex gap-3 mb-3 justify-content-center">
                  <label>
                    <input
                      type="radio"
                      name="proofType"
                      value="text"
                      checked={proofType === "text"}
                      onChange={() => setProofType("text")}
                    />{" "}
                    Text
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="proofType"
                      value="image"
                      checked={proofType === "image"}
                      onChange={() => setProofType("image")}
                    />{" "}
                    Imatge
                  </label>
                </div>
                {proofType === "text" && (
                  <>
                    <label htmlFor="proofText"><strong>Prova:</strong></label>
                    <textarea
                      className="form-control mb-2"
                      id="proofText"
                      value={proofText}
                      onChange={(e) => setProofText(e.target.value)}
                    />
                    {errors.proof && (
                      <small className="text-danger d-flex mb-2">{errors.proof}</small>
                    )}
                  </>
                )}
                {proofType === "image" && (
                  <>
                    <label htmlFor="proofImage"><strong>Selecciona una imatge:</strong></label>
                    <input
                      type="file"
                      className="form-control mb-2"
                      id="proofImage"
                      accept="image/*"
                      onChange={(e) => setProofImage(e.target.files?.[0] ?? null)}
                    />
                    {errors.proofImage && (
                      <small className="text-danger d-flex mb-2">{errors.proofImage}</small>
                    )}
                  </>
                )}
                {proofType === "image" && existingProof && !proofImage && (
                  <>
                    <strong>Imatge actual:</strong>
                    <div className="mb-2 text-center">
                      <img src={existingProof.proof} alt="No hi ha imatge" className="img-fluid" style={{ maxHeight: 200 }} />
                    </div>
                  </>
                )}
                <div className="d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => assignationSetter(null)}
                  >
                    Cancela
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Envia la prova
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}