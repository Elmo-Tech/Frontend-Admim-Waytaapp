import { platformFetch } from "@/lib/api/client";
import { data } from "@/lib/api/unwrap-data";

export interface AuditEntry {
  id: string;
  action: string;
  adminEmail: string;
  restaurantId: string | null;
  restaurantName: string | null;
  details: unknown;
  createdAt: string;
}

export const getAudit = (restaurantId?: string) =>
  data(
    platformFetch<{ data: AuditEntry[] }>(
      `/audit?limit=100${restaurantId ? `&restaurantId=${encodeURIComponent(restaurantId)}` : ""}`,
    ),
  );
