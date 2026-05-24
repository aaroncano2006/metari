import { useState } from "react";
import type { forgotPasswordType } from "../types/auth/forgotPasswordType";
import { fetchForgotPassword } from "../services/auth/forgotPasswordService";
import { forgotPasswordSchema } from "../schemas/auth/forgotPasswordSchema";


export default function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  // const rememberedPassword = localStorage.getItem("password");

  const [formData, setFormData] = useState<forgotPasswordType>({
    email_or_username: "",
  });

  const handleSubmit = async (data: forgotPasswordType) => {
    setError(null);
    setSuccess(false);
    setEmail("");

    const validation = forgotPasswordSchema.safeParse(data);
    if (!validation.success) {
      const errors: Record<string, string> = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });

      return setErrors(errors);
    }
    setErrors({});

    let response = null;
    try {
      response = await fetchForgotPassword(data);
      setEmail(response.email);
      setSuccess(true);
    } catch (error: any) {
      const message = error.request.responseText;
      const JSONmessage = JSON.parse(message);
      setError(`${JSONmessage.message}`);
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  return (
    <div className="text-center p-5 mb-5">
      <header className="container mt-2">
        <div className="row d-flex flex-column tiltWarp">
          <div className="col text-center mb-3">
            <h1 className="titol">Metari</h1>
          </div>
          <div className="col text-center">
            <h3 className="text-muted mx-auto">
              Recupera el control dels teus objectius!
            </h3>
          </div>
        </div>
      </header>

      <div className="mt-4">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && (
          <div className="alert alert-success">
            Revisa el teu correu electrònic <strong>({email})</strong> i restaura la teva contrasenya!
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(formData);
          }}
        >
          <div className="row mb-2">
            <label
              className="form-label text-start fw-bold"
              htmlFor="email_or_username"
            >
              Nom d'usuari o email <span className="text-danger">*</span>
            </label>

            <input
              className="form-control mb-2"
              type="text"
              name="email_or_username"
              id="email_or_username"
              value={formData.email_or_username}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email_or_username: e.target.value,
                })
              }
            />
            {errors.email_or_username && (
                <small className="text-danger d-flex mb-2">{errors.email_or_username}</small>
            )}
          </div>

          <div className="d-flex justify-content-end gap-5 mt-3">
            <button type="submit" className="btn btn-dark">
              Recupera l'accés
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
