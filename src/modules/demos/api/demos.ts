import { platformFetch } from "@/lib/api/client";
import { data } from "@/lib/api/unwrap-data";

/** The kinds of business a demo can show (DEC-061). */
export const DEMO_KINDS = ["restaurant", "cafe", "sweets"] as const;

export type DemoKind = (typeof DEMO_KINDS)[number];

/** Temporary demo restaurants (DEC-060). The link is returned once, when it is made. */
export interface DemoSummary {
  id: string;
  publicId: string;
  label: string;
  /** The kind of business the demo shows. */
  kind: DemoKind;
  /** LOCKED = ended, still inside the grace period before it is removed. */
  status: "ACTIVE" | "LOCKED";
  createdAt: string;
  expiresAt: string;
  removedAt: string;
  opened: boolean;
  lastOpenedAt: string | null;
  openCount: number;
  /** The package whose features the demo shows; null = every feature. */
  package: { id: string; name: string; nameEn: string } | null;
}

export const listDemos = () => data(platformFetch<{ data: DemoSummary[] }>("/demos"));

export const createDemo = (input: { label: string; hours: number; packageId?: string; kind?: DemoKind }) =>
  data(platformFetch<{ data: { demo: DemoSummary; link: string } }>("/demos", { method: "POST", body: input }));

export const extendDemo = (id: string, hours: number) =>
  data(platformFetch<{ data: DemoSummary }>(`/demos/${encodeURIComponent(id)}/extend`, { method: "POST", body: { hours } }));

export const newDemoLink = (id: string) =>
  data(platformFetch<{ data: { demo: DemoSummary; link: string } }>(`/demos/${encodeURIComponent(id)}/link`, { method: "POST" }));

export const removeDemo = (id: string) =>
  platformFetch<void>(`/demos/${encodeURIComponent(id)}`, { method: "DELETE" });
