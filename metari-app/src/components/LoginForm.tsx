import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchLogin } from "../services/auth/loginService";
import type { loginType } from "../types/auth/loginType";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);

  const rememberedPassword = localStorage.getItem("password");

  const [formData, setFormData] = useState<loginType>({
    email_or_username: "",
    password: rememberedPassword ?? "",
    remember_password: rememberedPassword ? true : false,
  });

  const navigate = useNavigate();

  const handleSubmit = async (data: loginType) => {
    setError(null);

    if (!data.email_or_username.trim()) {
      return setError("El username o email és obligatori!");
    }

    if (!data.password.trim()) {
      return setError("La contrasenya és obligatòria!");
    }

    if (data.remember_password) {
      localStorage.setItem("password", data.password);
    }

    if (!data.remember_password && rememberedPassword) {
      localStorage.removeItem("password");
    }

    try {
      const response = await fetchLogin(data);

      console.log(response);

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
          </div>

          <div className="row mb-4">
            <a href="/forgot-password" className="text-start">
              Has oblidat la teva contrasenya?
            </a>
          </div>

          <div className="row mb-2 text-start">
            <div className="col-1">
              <input
                className="form-check-input"
                type="checkbox"
                name="remember_password"
                id="remember_password"
                checked={formData.remember_password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    remember_password: e.target.checked,
                  })
                }
              />
            </div>

            <div className="col-5">
              <label className="form-check-label" htmlFor="remember_password">
                Recordar contrasenya
              </label>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-5 mt-3">
            <a href="/register" className="text-start">
              No tens compte? Registra't
            </a>

            <button type="submit" className="btn btn-dark">
              Inicia sessió
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
