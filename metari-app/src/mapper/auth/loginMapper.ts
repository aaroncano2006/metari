import type { loginType } from "../../types/auth/loginType"
import type { registerType } from "../../types/auth/registerType"

export function mapLogin(register: registerType): loginType {
  return {
    email_or_username: register.email,
    password: register.password,
    remember_password: false,
  }
}