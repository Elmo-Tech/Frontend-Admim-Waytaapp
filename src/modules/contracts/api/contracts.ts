import { PLATFORM_API } from "@/config/api";
import { platformFetch } from "@/lib/api/client";
import type { Locale } from "@/lib/i18n/locale";

const contractPath = (id: string) => `/subscriptions/${encodeURIComponent(id)}/contract`;

export const writeContract = (id: string, issue: boolean, body: { revision: number; locale: Locale; text: string }) =>
  platformFetch(`${contractPath(id)}/${issue ? "issue" : "draft"}`, { method: issue ? "POST" : "PUT", body });

export const reopenContract = (id: string) => platformFetch(`${contractPath(id)}/reopen`, { method: "POST" });

/** Multipart requests must let the browser set Content-Type and its boundary. */
export const uploadContractAsset = (id: string, kind: "seal" | "signature", body: FormData) =>
  fetch(`${PLATFORM_API}${contractPath(id)}/images/${kind}`, { method: "PUT", credentials: "include", body });
