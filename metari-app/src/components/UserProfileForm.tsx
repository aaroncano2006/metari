import { useState } from "react";
import { getUserEmail, getUserFullName, getUserName } from "../services/auth/loginService";
import type { profileType } from "../types/auth/profileType";

export default function UserProfileForm() {
  const [error, setError] = useState<string | null>(null);

  const rememberedPassword = localStorage.getItem("password");

  const fullName = getUserFullName() ?? "";
  const username = getUserName() ?? "";
  const email = getUserEmail() ?? "";

  const [formData, setFormData] = useState<profileType>({
    name: fullName,
    username,
    email,
    password: rememberedPassword ?? ""
  });

  const handleSubmit = () => {};

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
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
