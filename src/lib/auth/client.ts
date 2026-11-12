import { platformFetch } from "@/lib/api/client";
import { data } from "@/lib/api/unwrap-data";
import type { Admin } from "@/lib/auth/types";

export const login = (email: string, password: string) =>
  data(platformFetch<{ data: Admin }>("/auth/login", { method: "POST", body: { email, password } }));

export const getMe = () => data(platformFetch<{ data: Admin }>("/auth/me"));

export const logout = () => platformFetch<void>("/auth/logout", { method: "POST" });

export const changeOwnPassword = (currentPassword: string, newPassword: string) =>
  platformFetch<void>("/auth/password", { method: "PUT", body: { currentPassword, newPassword } });
