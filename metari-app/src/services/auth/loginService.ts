import { axiosConnection } from "../axiosConnection";
import type { loginType } from "../../types/auth/loginType";

export async function fetchLogin(data: loginType): Promise<any> {
  const response = await axiosConnection.post("/login", data);
  return response.data;
}

export function getUserRole(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  return payload.role;
}

export function getUserName(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  return payload.username;
}

export function getUserFullName(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  return payload.name;
}

export function getUserId(): number | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  return payload.id;
}

export function getUserEmail(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  return payload.email;
}

export function getUserStats(): any {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  return {
    completed_tasks: payload.completed_tasks,
    score: payload.score
  }
}

function decodeJwtPayload(token: string): any {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const binaryStr = atob(base64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}