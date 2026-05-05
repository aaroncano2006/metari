import { useState } from "react";
import {
  getUserEmail,
  getUserFullName,
  getUserId,
  getUserName,
} from "../services/auth/loginService";
import type { profileType } from "../types/auth/profileType";
import { updateProfile } from "../services/auth/profileService";
import { emailExists, usernameExists } from "../services/userService";

export default function UserProfileForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const rememberedPassword = localStorage.getItem("password");

  const fullName = getUserFullName() ?? "";
  const username = getUserName() ?? "";
  const email = getUserEmail() ?? "";
  const userId = getUserId() ?? 0;

  const [formData, setFormData] = useState<profileType>({
    name: fullName,
    username,
    email,
    password: rememberedPassword ?? "",
  });

  const handleSubmit = async (data: profileType) => {
    setError(null);
    setSuccess(false);

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

      const existingUsername = await usernameExists(data.username, userId);

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

      const existingEmail = await emailExists(data.email, userId);

      if (existingEmail) {
        return setError("L'email introduït ja està registrat!");
      }
    }

    if (!data.password?.trim()) {
      return setError("La contrasenya és obligatòria");
    }

    if (data.password) {
      if (typeof data.password !== "string") {
        return setError(
          "La contrasenya introduïda no és vàlida! Ha de ser un text!",
        );
      }

      if (data.password.length < 8) {
        return setError("La contrasenya ha de contenir almenys 8 caràcters!");
      }
    }

    try {
      const response = await updateProfile(data);

      console.log(response);

      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      setSuccess(true);
    } catch (error: any) {
      setError("Error: " + error);
    }
  };

  return (
    <>
      {success && 
      <div className="alert alert-success alert-profile">
        Dades actualitzades correctament!
      </div>}
      {error && 
      <div className="alert alert-danger alert-profile">
        {error}
      </div>
      }
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(formData);
        }}
      >
        <div className="row mb-2 user-profile-form-row">
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

        <div className="row mb-2 user-profile-form-row">
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

        <div className="row mb-2 user-profile-form-row">
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

        <div className="row mb-2 user-profile-form-row">
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

        <button type="submit" className="btn btn-dark">
          Desa
        </button>
      </form>
    </>
  );
}
