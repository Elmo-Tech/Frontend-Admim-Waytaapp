import { platformFetch } from "@/lib/api/client";
import { data } from "@/lib/api/unwrap-data";

export interface PlatformPublicSettings {
  poweredByUrl: string;
  updatedAt: string | null;
}

export interface PlatformTrialSettings {
  enabled: boolean;
  defaultDays: number;
  defaultPackage: { id: string; name: string } | null;
  updatedAt: string | null;
}

export const getPublicSettings = () =>
  data(platformFetch<{ data: PlatformPublicSettings }>("/settings/public"));

export const updatePublicSettings = (poweredByUrl: string) =>
  data(
    platformFetch<{ data: PlatformPublicSettings }>("/settings/public", {
      method: "PUT",
      body: { poweredByUrl },
    }),
  );

export const getTrialSettings = () =>
  data(platformFetch<{ data: PlatformTrialSettings }>("/settings/trial"));

export const updateTrialSettings = (input: {
  enabled: boolean;
  defaultDays: number;
  defaultPackageId: string | null;
}) =>
  data(
    platformFetch<{ data: PlatformTrialSettings }>("/settings/trial", {
      method: "PUT",
      body: input,
    }),
  );

/** AI menu import settings and the Gemini keys (DEC-059). A key value is never returned: only its label and last four characters. */
export type AiEngine = "N8N" | "DIRECT";

export type AiKeyStatus = "ACTIVE" | "DISABLED";

export type AiKeyTestResult = "OK" | "LIMITED" | "REJECTED" | "UNAVAILABLE" | "REQUEST_REFUSED";

export const AI_MAX_KEYS = 20;

export interface PlatformAiSettings {
  engine: AiEngine;
  model: string;
  fallbackModel: string | null;
  /** False until `AI_KEYS_ENCRYPTION_KEY` is set on the server. */
  encryptionConfigured: boolean;
  activeKeyCount: number;
  updatedAt: string;
}

export interface PlatformAiKey {
  id: string;
  label: string;
  last4: string;
  status: AiKeyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformAiOverview {
  settings: PlatformAiSettings;
  keys: PlatformAiKey[];
}

export interface PlatformAiKeyTest {
  result: AiKeyTestResult;
  model: string;
  httpStatus: number | null;
}

export const getAiSettings = () => data(platformFetch<{ data: PlatformAiOverview }>("/settings/ai"));

export const updateAiSettings = (input: { engine?: AiEngine; model?: string; fallbackModel?: string | null }) =>
  data(platformFetch<{ data: PlatformAiSettings }>("/settings/ai", { method: "PUT", body: input }));

export const addAiKey = (input: { label: string; secret: string }) =>
  data(platformFetch<{ data: PlatformAiKey }>("/settings/ai/keys", { method: "POST", body: input }));

export const updateAiKey = (id: string, input: { label?: string; status?: AiKeyStatus }) =>
  data(
    platformFetch<{ data: PlatformAiKey }>(`/settings/ai/keys/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: input,
    }),
  );

export const deleteAiKey = (id: string) =>
  platformFetch<void>(`/settings/ai/keys/${encodeURIComponent(id)}`, { method: "DELETE" });

export const testAiKey = (id: string) =>
  data(
    platformFetch<{ data: PlatformAiKeyTest }>(`/settings/ai/keys/${encodeURIComponent(id)}/test`, {
      method: "POST",
    }),
  );

export const adjustActiveTrials = (days: number) =>
  data(
    platformFetch<{ data: { adjusted: number; skipped: number } }>("/settings/trial/adjust-active", {
      method: "POST",
      body: { days },
    }),
  );
