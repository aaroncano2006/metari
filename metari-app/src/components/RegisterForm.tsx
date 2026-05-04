import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRegister } from "../services/auth/registerService";
import type { registerType } from "../types/auth/registerType";
import { usernameExists } from "../services/userService";

export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<registerType>({
    // email_or_username: "",
    // password: "",
    // remember_password: false,
    name: "",
    username: "",
    email: "",
    password: "",
    remember_password: false,
  });

  const navigate = useNavigate();

  const handleSubmit = async (data: registerType) => {
    setError(null);

    if (!data.name.trim()) {
      return setError("El nom és obligatori!");
    }

    if (data.name && typeof data.name !== "string") {
      return setError("El nom enviat no és vàlid! Ha de ser un text");
    }

    if (!data.username.trim()) {
      return setError("El nom d'usuari és obligatori!");
    }

    if (data.username) {
      if (typeof data.username !== "string") {
        return setError(
          "El nom d'usuari enviat no és vàlid! Ha de ser un text",
        );
      }

      if (!/[a-zA-Z0-9]+$/.test(data.username)) {
        return setError(
          "El nom d'usuari només pot contenir lletres i números!",
        );
      }

      if (data.username.length < 5) {
        return setError("El nom d'usuari ha de contenir almenys 5 caràcters!");
      }

      const existingUsername = await usernameExists(data.username);

      if (existingUsername) {
        return setError("El nom d'usuari introduït ja està registrat!");
      }
    }

    if (!data.email.trim()) {
      return setError("L'email és obligatori!");
    }

    if (data.email) {
      if (typeof data.email !== "string") {
        return setError("L'email de l'usuari no és vàlid! Ha de ser un text");
      }

      if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9._%+-]+\.[a-zA-Z]{2,}$/.test(data.email)
      ) {
        return setError("El format de l'email no és vàlid!");
      }
    }

    if (!data.password.trim()) {
      return setError("La contrasenya és obligatòria");
    }

    if (data.password) {
      if (typeof data.password !== "string") {
        return setError("La contrasenya introduïda no és vàlida! Ha de ser un text!");
      }

      if (data.password.length < 8) {
        return setError("La contrasenya ha de contenir almenys 8 caràcters!");
      }
    }

    if (data.remember_password) {
      localStorage.setItem("password", data.password);
    }

    try {
      const response = await fetchRegister(data);

      console.log(response);

      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      window.dispatchEvent(new Event("authChange"));

      navigate("/");
    } catch (error: any) {
      setError("Error al registrar-se: " + error);
      localStorage.removeItem("token");
      localStorage.removeItem("password");
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
          </div>

          <div className="row mb-2">
            <label className="form-label text-start" htmlFor="username">
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

          <div className="row mb-2 text-start">
            <div className="col-1">
              <input
                className="form-check-input"
                type="checkbox"
                name="remember_password"
                id="remember_password"
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
            <a href="#" className="text-start">
              Has oblidat la teva contrasenya?
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
