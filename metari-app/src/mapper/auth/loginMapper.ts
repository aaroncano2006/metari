import type { loginType } from "../../types/auth/loginType";
import type { profileType } from "../../types/auth/profileType";
import type { registerType } from "../../types/auth/registerType";

export function mapLogin(data: registerType | profileType): loginType {
  return {
    email_or_username: data.email ?? data.username ?? "",
    password: data.password ?? "",
    remember:
      "remember" in data ? (data.remember ?? false) : false,
  };
}
