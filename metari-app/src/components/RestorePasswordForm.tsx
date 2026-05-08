import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import type { restorePasswordType } from "../types/auth/restorePasswordType";
import { fetchRestorePassword } from "../services/auth/restorePasswordService";

export default function RestorePasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  if (!token.trim()) {
    navigate("/forgot-password");
  }
  const [formData, setFormData] = useState<restorePasswordType>({
    token: token,
    new_password: "",
    confirm_password: "",
  });

  const handleSubmit = async (data: restorePasswordType) => {
    setError(null);
    setSuccess(false);

    if (!data.new_password.trim()) {
      return setError("La contrasenya és obligatòria");
    }

    if (data.new_password) {
      if (typeof data.new_password !== "string") {
        return setError(
          "La contrasenya introduïda no és vàlida! Ha de ser un text!",
        );
      }

      if (data.new_password.length < 8) {
        return setError("La contrasenya ha de contenir almenys 8 caràcters!");
      }
    }

    if (!data.confirm_password.trim()) {
      return setError("La contrasenya és obligatòria");
    }

    if (data.confirm_password) {
      if (typeof data.confirm_password !== "string") {
        return setError(
          "La contrasenya introduïda no és vàlida! Ha de ser un text!",
        );
      }

      if (data.confirm_password.length < 8) {
        return setError("La contrasenya ha de contenir almenys 8 caràcters!");
      }
    }

    if (data.new_password !== data.confirm_password) {
      return setError("Les contrasenyes no coincideixen!");
    }

    let response = null;
    try {
      response = await fetchRestorePassword(data);
      setSuccess(true);
    } catch (error: any) {
      setError(`${error}`);
    }
  };

  if (!token) {
    return <div className="alert alert-danger">Token no trobat a la URL</div>;
  }

  return (
    <div className="card form-card text-center p-5">
      <figure>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/330px-Placeholder_view_vector.svg.png"
          className="img-thumbnail"
          alt="img-thumbnail"
        />
      </figure>

      <header className="mt-2">
        <h1>Metari</h1>
        <h3 className="text-muted">Restableix la contrasenya!</h3>
      </header>

      <div className="mt-4">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && (
          <div className="alert alert-success">
            Contrasenya restablerta correctament!{" "}
            <a href="/login">Inicia Sessió</a>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(formData);
          }}
        >
          <div className="row mb-2">
            <label className="form-label text-start" htmlFor="confirm_password">
              Nova contrasenya <span className="text-danger">*</span>
            </label>

            <input
              className="form-control mb-2"
              type="password"
              name="confirm_password"
              id="confirm_password"
              value={formData.confirm_password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirm_password: e.target.value,
                })
              }
            />
          </div>

          <div className="row mb-2">
            <label className="form-label text-start" htmlFor="new_password">
              Confirma nova contrasenya <span className="text-danger">*</span>
            </label>

            <input
              className="form-control mb-2"
              type="password"
              name="new_password"
              id="new_password"
              value={formData.new_password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  new_password: e.target.value,
                })
              }
            />
          </div>

          <div className="d-flex justify-content-end gap-5 mt-3">
            <button type="submit" className="btn btn-dark">
              Restableix la contrasenya
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
