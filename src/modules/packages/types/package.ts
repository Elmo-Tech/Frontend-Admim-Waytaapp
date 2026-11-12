import type { FeatureKey } from "@/lib/permissions/features";
import type { RestaurantStatus } from "@/types/restaurant";
import type { PackageTemplate } from "../constants/templates";

export type PackageStatus = "ACTIVE" | "ARCHIVED";

/** Every template (also ones added later), or the chosen ones. Meaningful when the package includes Menu designs. */
export interface PackageTemplates {
  all: boolean;
  /** Every standard design (also future ones) and no premium one unless it is chosen (DEC-052). */
  allStandard: boolean;
  selected: PackageTemplate[];
}

export interface PackagePrices {
  egpMonthly: string | null;
  egpYearly: string | null;
  usdMonthly: string | null;
  usdYearly: string | null;
}

/** A percentage off the list price while it is on; `endsAt` is the last day (YYYY-MM-DD) or null. */
export interface PackageOffer {
  percent: string;
  label: string | null;
  endsAt: string | null;
  active: boolean;
}

export interface PackageSummary {
  id: string;
  /** Arabic aliases kept by the API for backward compatibility. */
  name: string;
  description: string | null;
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  status: PackageStatus;
  /** List prices per billing currency and period, as strings; null = not offered (DEC-049). */
  prices: PackagePrices;
  offer: PackageOffer | null;
  templates: PackageTemplates;
  features: FeatureKey[];
  restaurantCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PackageDetail extends PackageSummary {
  restaurants: { id: string; name: string; status: RestaurantStatus }[];
}

/** What the package form sends (the Backend normalizes the prices). */
export interface PackageInput {
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  prices: PackagePrices;
  /** null removes the offer. */
  offer: { percent: string; label: string | null; endsAt: string | null } | null;
  templates: PackageTemplates;
  features: FeatureKey[];
  status?: PackageStatus;
}
