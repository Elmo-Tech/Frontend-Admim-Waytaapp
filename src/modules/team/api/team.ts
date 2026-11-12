import { platformFetch } from "@/lib/api/client";
import { data } from "@/lib/api/unwrap-data";

export interface AdminSummary {
  id: string;
  email: string;
  displayName: string;
  status: "ACTIVE" | "DISABLED";
  lastLoginAt: string | null;
  createdAt: string;
}

export const listAdmins = () => data(platformFetch<{ data: AdminSummary[] }>("/admins"));

export const createAdmin = (input: { email: string; displayName: string; password: string }) =>
  data(platformFetch<{ data: AdminSummary }>("/admins", { method: "POST", body: input }));

export const setAdminStatus = (id: string, status: "ACTIVE" | "DISABLED") =>
  data(
    platformFetch<{ data: AdminSummary }>(`/admins/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      body: { status },
    }),
  );

export const resetAdminPassword = (id: string, password: string) =>
  platformFetch<void>(`/admins/${encodeURIComponent(id)}/password`, { method: "PUT", body: { password } });
