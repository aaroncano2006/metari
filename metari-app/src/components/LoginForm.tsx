import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchLogin } from "../services/auth/loginService";
import type { loginType } from "../types/auth/loginType";
import { loginSchema } from "../schemas/auth/loginSchema";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null); // Error de credencials o de servidor
  const [errors, setErrors] = useState<Record<string, string>>({}); // Error de validacions Zod

  const rememberedPassword = localStorage.getItem("password");
  const rememberedEmail = localStorage.getItem("email_or_username");

  const [formData, setFormData] = useState<loginType>({
    email_or_username: rememberedEmail ?? "",
    password: rememberedPassword ?? "",
    remember: !!(rememberedPassword || rememberedEmail),
  });

  const navigate = useNavigate();

  const handleSubmit = async (data: loginType) => {
    setError(null);

    const validation = loginSchema.safeParse(data);
    if (!validation.success) {
      const errors: Record<string, string> = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });

      return setErrors(errors);
    }
    setErrors({});

    if (data.remember) {
      localStorage.setItem("email_or_username", data.email_or_username);
      localStorage.setItem("password", data.password);
    }

    if (!data.remember && (rememberedPassword || rememberedEmail)) {
      localStorage.removeItem("email_or_username");
      localStorage.removeItem("password");
    }

    try {
      const response = await fetchLogin(data);

      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      window.dispatchEvent(new Event("authChange"));

      navigate("/");
    } catch (error: any) {
      setError("Credencials incorrectes o error del servidor");
      localStorage.removeItem("token");
      if (!rememberedPassword) {
        localStorage.removeItem("password");
      }
      if (!rememberedEmail) {
        localStorage.removeItem("email_or_username");
      }
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

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
        <h3 className="text-muted">
          Torna a lluitar per tot el que vols aconseguir
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
            <label
              className="form-label text-start"
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
              <small className="text-danger d-flex mb-2">{errors.password}</small>
            )}
          </div>

          <div className="row mb-4">
            <Link to="/forgot-password" className="text-start">
              Has oblidat la teva contrasenya?
            </Link>
          </div>

          <div className="row mb-2 text-start">
            <div className="col-1">
              <input
                className="form-check-input"
                type="checkbox"
                name="remember"
                id="remember"
                checked={formData.remember}
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
            <Link to="/register" className="text-start">
                No tens compte? Registra't
            </Link>

            <button type="submit" className="btn btn-dark">
              Inicia sessió
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
