import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRegister } from "../services/auth/registerService";
import type { registerType } from "../types/auth/registerType";
import { registerSchema } from "../schemas/auth/registerSchema";

export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<registerType>({
    name: "",
    username: "",
    email: "",
    password: "",
    repeat_password: "",
    remember: false,
  });

  const navigate = useNavigate();

  const handleSubmit = async (data: registerType) => {
    setError(null);

    const validation = await registerSchema.safeParseAsync(data);
    if (!validation.success) {
      const errors: Record<string, string> = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });

      return setErrors(errors);
    }
    setErrors({});

    if (data.password !== data.repeat_password) {
      return setError("Les contrasenyes no coincideixen!");
    }

    if (data.remember) {
      localStorage.setItem("email_or_username", data.email);
      localStorage.setItem("password", data.password);
    }

    try {
      const response = await fetchRegister(data);

      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      window.dispatchEvent(new Event("authChange"));

      navigate("/");
    } catch (error: any) {
      setError("Error al registrar-se: " + error);
      localStorage.removeItem("token");
      localStorage.removeItem("email_or_username");
      localStorage.removeItem("password");
    }
  };

  return (
    <div className="card form-card text-center p-5 mb-5">
      <figure>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/330px-Placeholder_view_vector.svg.png"
          className="img-thumbnail"
          alt="img-thumbnail"
        />
      </figure>

      <header className="mt-2">
        <h1>Metari</h1>
        <h3 className="text-muted">
          Descobreix la nova forma d'aconseguir les teves metes!
        </h3>
      </header>

      <div className="mt-4">
        {error && <div className="alert alert-danger">{error}</div>}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(formData);
          }}
        >
          <div className="row mb-2">
            <label className="form-label text-start" htmlFor="name">
              Nom <span className="text-danger">*</span>
            </label>

            <input
              className="form-control mb-2"
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
            />
            {errors.name && (
              <small className="text-danger d-flex mb-2">{errors.name}</small>
            )}
          </div>

          <div className="row mb-2">
            <label className="form-label text-start" htmlFor="username">
              Username <span className="text-danger">*</span>
            </label>

            <input
              className="form-control mb-2"
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  username: e.target.value,
                })
              }
            />
            {errors.username && (
              <small className="text-danger d-flex mb-2">
                {errors.username}
              </small>
            )}
          </div>

          <div className="row mb-2">
            <label className="form-label text-start" htmlFor="email">
              Email <span className="text-danger">*</span>
            </label>

            <input
              className="form-control mb-2"
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
            />
            {errors.email && (
              <small className="text-danger d-flex mb-2">
                {errors.email}
              </small>
            )}
          </div>

          <div className="row mb-2">
            <label className="form-label text-start" htmlFor="password">
              Contrasenya <span className="text-danger">*</span>
            </label>

            <input
              className="form-control mb-2"
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
            />
            {errors.password && (
              <small className="text-danger d-flex mb-2">
                {errors.password}
              </small>
            )}
          </div>

          <div className="row mb-2">
            <label className="form-label text-start" htmlFor="repeat_password">
              Repeteix la contrasenya <span className="text-danger">*</span>
            </label>

            <input
              className="form-control mb-2"
              type="password"
              name="repeat_password"
              id="repeat_password"
              value={formData.repeat_password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  repeat_password: e.target.value,
                })
              }
            />
            {errors.repeat_password && (
              <small className="text-danger d-flex mb-2">
                {errors.repeat_password}
              </small>
            )}
          </div>

          <div className="row mb-2 text-start">
            <div className="col-1">
              <input
                className="form-check-input"
                type="checkbox"
                name="remember"
                id="remember"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    remember: e.target.checked,
                  })
                }
              />
            </div>

            <div className="col-5">
              <label className="form-check-label" htmlFor="remember">
                Recordar credencials
              </label>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-5 mt-3">
            <a href="/login" className="text-start">
              Tens un compte? Inicia sessió
            </a>

            <button type="submit" className="btn btn-dark">
              Registra't
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
