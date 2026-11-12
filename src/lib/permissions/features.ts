
export const FEATURE_KEYS = [
  "WHATSAPP_ORDERING",
  "ORDER_TRACKING",
  "SMART_SUGGESTIONS",
  "MENU_TEMPLATES",
  "DASHBOARD_ORDERING",
  "KITCHEN",
  "TABLE_ORDERING",
  "MENU_IMPORT",
  "OFFERS",
] as const;

export type FeatureKey = (typeof FEATURE_KEYS)[number];

/**
 * Features that are OFF until the platform turns them on (DEC-057): a package includes one only if it lists it, and a
 * restaurant with no package does not have it. "Select all" skips them, and a restaurant without them is not "restricted".
 */
export const OPT_IN_FEATURES: readonly FeatureKey[] = ["MENU_IMPORT"];

/**
 * The three ways a guest can place an order. Each is its own feature: a package with none of them
 * is a view-only menu (the guest can browse, not order).
 */
export const ORDERING_FEATURES: readonly FeatureKey[] = ["WHATSAPP_ORDERING", "DASHBOARD_ORDERING", "TABLE_ORDERING"];

/** The features the package editor lists under "ordering": the order channels and the kitchen screen (which is not itself a way to receive orders). */
export const ORDERING_GROUP: readonly FeatureKey[] = [...ORDERING_FEATURES, "KITCHEN"];

export const isDisplayOnly = (features: readonly FeatureKey[]) =>
  !features.some((key) => ORDERING_FEATURES.includes(key));
