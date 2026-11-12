import { platformFetch } from "@/lib/api/client";
import { data } from "@/lib/api/unwrap-data";
import type { PackageDetail, PackageInput, PackageSummary } from "../types/package";

export const listPackages = () => data(platformFetch<{ data: PackageSummary[] }>("/packages"));

export const getPackage = (id: string) =>
  data(platformFetch<{ data: PackageDetail }>(`/packages/${encodeURIComponent(id)}`));

export const createPackage = (input: PackageInput) =>
  data(platformFetch<{ data: PackageSummary }>("/packages", { method: "POST", body: input }));

export const updatePackage = (id: string, input: Partial<PackageInput>) =>
  data(
    platformFetch<{ data: PackageSummary }>(`/packages/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: input,
    }),
  );

export const deletePackage = (id: string) =>
  platformFetch<void>(`/packages/${encodeURIComponent(id)}`, { method: "DELETE" });
