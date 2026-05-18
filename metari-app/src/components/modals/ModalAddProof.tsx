import { useState } from "react"
import type { assignationType } from "../../types/assignationType"
import { getUserId } from "../../services/auth/loginService"
import { createProof } from "../../services/proofService"
type ModalProps = {
  assignation: assignationType
  assignationSetter: React.Dispatch<React.SetStateAction<assignationType | null>>
}
export function ModalAddProof({ assignation, assignationSetter }: ModalProps) {
  const [proofType, setProofType] = useState<"text" | "image">("text")
  const [proofText, setProofText] = useState("")
  const [proofImage, setProofImage] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setErrors({})

    const userId = getUserId()
    
    if (proofType === "text") {
      if (!proofText.trim()) {
        setErrors({ proof: "El text de la prova no pot estar buit" })
        return
      }
      await createProof({
        assignation_id: assignation.id,
        user_id: userId,
        proof: proofText,
        proof_type: "text",
        is_valid: false,
      })
      assignationSetter(null)
    }
    if (proofType === "image" && proofImage) {
      const reader = new FileReader()
      reader.onload = async () => {
        await createProof({
          assignation_id: assignation.id,
          user_id: userId,
          proof: reader.result as string,
          proof_type: "image",
          is_valid: false,
        })
        assignationSetter(null)
      }
      reader.readAsDataURL(proofImage)
    }
  }
  return (
    <div className="modalOverlay h-100 w-100">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-6">
            <div className="modalWindow">
              <h5>Envia una prova</h5>
              <form onSubmit={handleSubmit}>
                <label>Tipus de prova</label>
                <div className="d-flex gap-3 mb-3">
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
                    <label htmlFor="proofText">Prova</label>
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
                    <label htmlFor="proofImage">Selecciona una imatge</label>
                    <input
                      type="file"
                      className="form-control mb-2"
                      id="proofImage"
                      accept="image/*"
                      onChange={(e) => setProofImage(e.target.files?.[0] ?? null)}
                    />
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