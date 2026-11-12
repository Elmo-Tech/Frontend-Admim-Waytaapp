import { platformFetch } from "@/lib/api/client";
import { data } from "@/lib/api/unwrap-data";
import type { FeatureKey } from "@/lib/permissions/features";
import type { SubscriptionBrief } from "@/modules/billing";
import type { PackageTemplate } from "@/modules/packages";
import type { RestaurantStatus } from "@/types/restaurant";

/** Private customer contact details, visible only to Platform Administrators. */
export interface OwnerContact {
  fullName: string;
  phone: string;
  facebookUrl: string | null;
}

export interface RestaurantSummary {
  ownerContact: OwnerContact | null;
  id: string;
  publicId: string;
  name: string;
  status: RestaurantStatus;
  defaultLocale: string;
  currencyCode: string;
  createdAt: string;
  counts: { branches: number; products: number; staff: number; orders30d: number };
  /** The package the platform assigned; null = none, every feature. */
  package: { id: string; name: string } | null;
  /** Features this restaurant effectively lacks (package and overrides applied). */
  disabledFeatures: FeatureKey[];
  /** Its subscription today; null = it never had one. */
  subscription: SubscriptionBrief | null;
}

export interface RestaurantPage {
  items: RestaurantSummary[];
  page: number;
  pageSize: number;
  total: number;
}

export type FeatureSource = "override" | "package" | "default";

export interface FeatureState {
  key: FeatureKey;
  enabled: boolean;
  overridden: boolean;
  /** What decides it: the restaurant's own override, its package, or the default. */
  source: FeatureSource;
  /** What it would be without the restaurant's own override. */
  baseEnabled: boolean;
}

/** Compiled bespoke renderers of this build; each belongs to exactly one Restaurant. */
export type ExclusiveRendererKey = "VERDE_NAPOLI_V1" | "SHERBINY_FIRE_DOUGH_V1" | "MAKKBOZ_HERITAGE_V1" | "MEAT_LOVERS_BUTCHER_V1";

export const EXCLUSIVE_RENDERERS: { key: ExclusiveRendererKey; label: string }[] = [
  { key: "VERDE_NAPOLI_V1", label: "VERDE — Napoli Club" },
  { key: "SHERBINY_FIRE_DOUGH_V1", label: "El Sherbiny — Fire & Dough" },
  { key: "MAKKBOZ_HERITAGE_V1", label: "Makkboz — Heritage" },
  { key: "MEAT_LOVERS_BUTCHER_V1", label: "Meat Lovers — The Butcher's Edit" },
];

export type ExclusiveDesignStatus = "RESERVED" | "ACTIVE_BASE" | "ACTIVE_CUSTOM" | "DISABLED";

export type ExclusiveBaseTemplate = "CLASSIC" | PackageTemplate;

export interface ExclusiveDesignView {
  rendererKey?: ExclusiveRendererKey;
  baseTemplate: ExclusiveBaseTemplate;
  status: ExclusiveDesignStatus;
}

export type AcquisitionSourceType =
  | "CUSTOMER_REFERRAL"
  | "EMPLOYEE_REFERRAL"
  | "SALES"
  | "SOCIAL_MEDIA"
  | "PAID_AD"
  | "WEBSITE"
  | "DIRECT"
  | "OTHER"
  | "UNKNOWN";

export interface RestaurantAcquisitionInput {
  sourceType: AcquisitionSourceType;
  referringRestaurantId?: string | null;
  sourceName?: string | null;
  sourcePlatform?: string | null;
  sourceDetail?: string | null;
  campaign?: string | null;
}

export interface RestaurantAcquisitionView extends RestaurantAcquisitionInput {
  referringRestaurantName: string | null;
  recordedAt: string;
}

/** The readable Guest Menu link (DEC-066): `/q/{slug}`; former slugs keep redirecting. */
export interface MenuLink {
  slug: string | null;
  formerSlugs: string[];
  url: string | null;
}

export interface RestaurantDetail extends RestaurantSummary {
  menuLink: MenuLink;
  exclusiveDesign: ExclusiveDesignView | null;
  acquisition: RestaurantAcquisitionView | null;
  settings: {
    pickupEnabled: boolean;
    deliveryEnabled: boolean;
    tableOrderingEnabled: boolean;
    whatsappOrderingEnabled: boolean;
    menuTemplate: string;
    suggestionsMode: string;
  };
  owners: { email: string; status: string }[];
  features: FeatureState[];
  totals: { orders: number; activeBranches: number; tables: number };
}

export function listRestaurants(input: { search: string; status: RestaurantStatus | ""; subscription?: "TRIAL" | "PAID" | "NONE" | ""; page: number }) {
  const params = new URLSearchParams({ page: String(input.page), pageSize: "20" });
  if (input.search.trim()) params.set("search", input.search.trim());
  if (input.status) params.set("status", input.status);
  if (input.subscription) params.set("subscription", input.subscription);
  return data(platformFetch<{ data: RestaurantPage }>(`/restaurants?${params.toString()}`));
}

export const getRestaurant = (id: string) =>
  data(platformFetch<{ data: RestaurantDetail }>(`/restaurants/${encodeURIComponent(id)}`));

/** Only Platform Admins can assign/activate a tenant's private design slot. */
export const setExclusiveDesign = (
  restaurantId: string,
  input: ExclusiveDesignView,
) =>
  data(
    platformFetch<{ data: ExclusiveDesignView }>(
      `/restaurants/${encodeURIComponent(restaurantId)}/exclusive-design`,
      { method: "PUT", body: input },
    ),
  );

/** Edit the readable Guest Menu link; the previous one keeps redirecting. */
export const updateRestaurantMenuSlug = (id: string, slug: string) =>
  data(
    platformFetch<{ data: { slug: string } }>(
      `/restaurants/${encodeURIComponent(id)}/menu-slug`,
      { method: "PUT", body: { slug } },
    ),
  );

/** Correct an existing client's primary contact without touching their login. */
export const updateRestaurantOwnerContact = (
  id: string,
  contact: OwnerContact,
) =>
  data(
    platformFetch<{ data: OwnerContact }>(
      `/restaurants/${encodeURIComponent(id)}/owner-contact`,
      { method: "PUT", body: contact },
    ),
  );

export const setRestaurantStatus = (id: string, status: "ACTIVE" | "SUSPENDED") =>
  data(
    platformFetch<{ data: { status: RestaurantStatus } }>(`/restaurants/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      body: { status },
    }),
  );

/** `true` = allow, `false` = remove, `null` = back to the package (or the default without one). */
export const setRestaurantFeature = (id: string, feature: FeatureKey, enabled: boolean | null) =>
  data(
    platformFetch<{ data: FeatureState }>(
      `/restaurants/${encodeURIComponent(id)}/features/${feature}`,
      { method: "PUT", body: { enabled } },
    ),
  );

export interface NewRestaurantInput {
  restaurantName: string;
  ownerEmail: string;
  ownerPassword: string;
  branchName: string;
  defaultLocale: "ar" | "en";
  currencyCode: string;
  timezone: string;
  countryCode?: string;
  packageId: string | null;
  acquisition?: RestaurantAcquisitionInput | null;
  ownerContact?: OwnerContact | null;
}

export const createRestaurant = (input: NewRestaurantInput) =>
  data(
    platformFetch<{ data: { id: string; publicId: string; name: string; ownerEmail: string } }>("/restaurants", {
      method: "POST",
      body: input,
    }),
  );

/** `null` takes the restaurant off any package (every feature). */
export const assignRestaurantPackage = (restaurantId: string, packageId: string | null) =>
  data(
    platformFetch<{ data: { packageId: string | null } }>(
      `/restaurants/${encodeURIComponent(restaurantId)}/package`,
      { method: "PUT", body: { packageId } },
    ),
  );
