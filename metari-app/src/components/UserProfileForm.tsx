import { useState } from "react";
import {
  getUserEmail,
  getUserFullName,
  getUserId,
  getUserName,
} from "../services/auth/loginService";
import type { profileType } from "../types/auth/profileType";
import { updateProfile } from "../services/auth/profileService";
import { createProfileSchema } from "../schemas/auth/profileSchema";

export default function UserProfileForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<boolean>(false);

  const fullName = getUserFullName() ?? "";
  const username = getUserName() ?? "";
  const email = getUserEmail() ?? "";
  const userId = getUserId() ?? 0;

  const [formData, setFormData] = useState<profileType>({
    name: fullName,
    username,
    email,
    password: "",
  });

  const profileSchema = createProfileSchema(userId);

  const handleSubmit = async (data: profileType) => {
    setSuccess(false);

    const validation = await profileSchema.safeParseAsync(data);

    if (!validation.success) {
      const errors: Record<string, string> = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });
      
      return setErrors(errors);
    }

    setErrors({});

    const updateData: profileType = {
      name: data.name || fullName,
      username: data.username || username,
      email: data.email || email,
    };
    if (data.password) updateData.password = data.password;

    try {
      const response = await updateProfile(updateData);

      if (response?.token) {
        localStorage.setItem("token", response.token);
      }

      window.dispatchEvent(new Event("profileChange"));

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error: any) {
      setErrors({ form: "Error: " + error });
      setTimeout(() => {
        setErrors({})
      }, 5000);
    }
  };

  return (
    <>
      {success &&
        <div className="alert alert-success alert-profile">
          Dades actualitzades correctament!
        </div>}
      {errors.form &&
        <div className="alert alert-danger alert-profile">
          {errors.form}
        </div>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(formData);
        }}
      >
        <div className="row mb-2 user-profile-form-row">
          <label className="form-label text-start" htmlFor="name">
            Nom
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
          {errors.name &&
            <small className="text-danger d-flex mb-2">{errors.name}</small>}
        </div>

        <div className="row mb-2 user-profile-form-row">
          <label className="form-label text-start" htmlFor="username">
            Username
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
          {errors.username &&
            <small className="text-danger d-flex mb-2">{errors.username}</small>}
        </div>

        <div className="row mb-2 user-profile-form-row">
          <label className="form-label text-start" htmlFor="email">
            Email
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
          {errors.email &&
            <small className="text-danger d-flex mb-2">{errors.email}</small>}
        </div>

        <div className="row mb-2 user-profile-form-row">
          <label className="form-label text-start" htmlFor="password">
            Contrasenya
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
          {errors.password &&
            <small className="text-danger d-flex mb-2">{errors.password}</small>}
        </div>

        <button type="submit" className="btn btn-dark">
          Desa
        </button>
      </form>
    </>
  );
}
