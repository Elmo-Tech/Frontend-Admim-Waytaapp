import type { Translate } from "@/lib/i18n/translate";
import { FEATURE_KEYS, type FeatureKey } from "@/lib/permissions/features";
import { PREMIUM_TEMPLATES, STANDARD_TEMPLATES, type PackageTemplate } from "@/modules/packages/constants/templates";
import { type PackageDetail, type PackageInput } from "@/modules/packages/types/package";

/** A price as typed in the console: plain digits or correctly grouped thousands, with up to two decimals. */
const MONEY_INPUT = /^(?:\d{1,10}|\d{1,3}(?:,\d{3}){1,3})(?:\.\d{1,2})?$/;

/** An offer percentage: above 0, up to 100, at most two decimals. */
const PERCENT = /^\d{1,3}(\.\d{1,2})?$/;

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export type PriceField = "egpMonthly" | "egpYearly" | "usdMonthly" | "usdYearly";

export type FieldName = "nameAr" | "nameEn" | PriceField | "offerPercent" | "offerEndsAt";

export type FieldErrors = Partial<Record<FieldName, string>>;

export const FIELD_IDS: Record<FieldName, string> = {
  nameAr: "package-name-ar",
  nameEn: "package-name-en",
  egpMonthly: "package-egpMonthly",
  egpYearly: "package-egpYearly",
  usdMonthly: "package-usdMonthly",
  usdYearly: "package-usdYearly",
  offerPercent: "package-offer-percent",
  offerEndsAt: "package-offer-ends",
};

export interface FormState {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  prices: Record<PriceField, string>;
  offerOn: boolean;
  offerPercent: string;
  offerLabel: string;
  offerEndsAt: string;
  /** Menu designs (DEC-051, DEC-052): standard ones (all, or the ticked) and premium ones (none, the ticked, or all). */
  standardAll: boolean;
  standard: PackageTemplate[];
  premiumMode: PremiumMode;
  premium: PackageTemplate[];
  features: FeatureKey[];
}

type PremiumMode = "none" | "choose" | "all";

export const EMPTY: FormState = {
  nameAr: "",
  nameEn: "",
  descriptionAr: "",
  descriptionEn: "",
  prices: { egpMonthly: "", egpYearly: "", usdMonthly: "", usdYearly: "" },
  offerOn: false,
  offerPercent: "",
  offerLabel: "",
  offerEndsAt: "",
  standardAll: true,
  standard: [],
  premiumMode: "all",
  premium: [],
  features: [],
};

function templatesFrom(rule: PackageDetail["templates"]) {
  const standardAll = rule.all || rule.allStandard;
  const standard = rule.selected.filter((key) => (STANDARD_TEMPLATES as readonly string[]).includes(key));
  const premium = rule.selected.filter((key) => (PREMIUM_TEMPLATES as readonly string[]).includes(key));
  const premiumMode: PremiumMode =
    rule.all || premium.length === PREMIUM_TEMPLATES.length ? "all" : premium.length > 0 ? "choose" : "none";
  return { standardAll, standard, premiumMode, premium };
}

/** What the form gives: standard (Classic included) and premium design counts. */
export function templateCounts(form: FormState) {
  const standard = 1 + (form.standardAll ? STANDARD_TEMPLATES.length : form.standard.length);
  const premium =
    form.premiumMode === "all" ? PREMIUM_TEMPLATES.length : form.premiumMode === "choose" ? form.premium.length : 0;
  return { standard, premium };
}

export const formFrom = (pkg: PackageDetail): FormState => ({
  nameAr: pkg.nameAr,
  nameEn: pkg.nameEn,
  descriptionAr: pkg.descriptionAr ?? "",
  descriptionEn: pkg.descriptionEn ?? "",
  prices: {
    egpMonthly: pkg.prices.egpMonthly ?? "",
    egpYearly: pkg.prices.egpYearly ?? "",
    usdMonthly: pkg.prices.usdMonthly ?? "",
    usdYearly: pkg.prices.usdYearly ?? "",
  },
  offerOn: pkg.offer !== null,
  offerPercent: pkg.offer?.percent ?? "",
  offerLabel: pkg.offer?.label ?? "",
  offerEndsAt: pkg.offer?.endsAt ?? "",
  ...templatesFrom(pkg.templates),
  features: pkg.features,
});

const orNull = (value: string) => (value.trim() === "" ? null : value.trim());

const moneyOrNull = (value: string) => {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed.replaceAll(",", "");
};

/** "All" of both tiers is the open-ended rule; anything else lists what is chosen. */
function templatesInput(form: FormState): PackageInput["templates"] {
  if (form.standardAll && form.premiumMode === "all") return { all: true, allStandard: false, selected: [] };
  const premium =
    form.premiumMode === "all" ? [...PREMIUM_TEMPLATES] : form.premiumMode === "choose" ? form.premium : [];
  return {
    all: false,
    allStandard: form.standardAll,
    selected: [
      ...STANDARD_TEMPLATES.filter((key) => !form.standardAll && form.standard.includes(key)),
      ...PREMIUM_TEMPLATES.filter((key) => premium.includes(key)),
    ],
  };
}

/** The form's text as the API's input: empty prices, description and offer parts are `null`. */
export function toInput(form: FormState): PackageInput {
  return {
    nameAr: form.nameAr.trim(),
    nameEn: form.nameEn.trim(),
    descriptionAr: orNull(form.descriptionAr),
    descriptionEn: orNull(form.descriptionEn),
    prices: {
      egpMonthly: moneyOrNull(form.prices.egpMonthly),
      egpYearly: moneyOrNull(form.prices.egpYearly),
      usdMonthly: moneyOrNull(form.prices.usdMonthly),
      usdYearly: moneyOrNull(form.prices.usdYearly),
    },
    offer: form.offerOn
      ? { percent: form.offerPercent.trim(), label: orNull(form.offerLabel), endsAt: orNull(form.offerEndsAt) }
      : null,
    templates: templatesInput(form),
    features: FEATURE_KEYS.filter((key) => form.features.includes(key)),
  };
}

/** Every invalid field, so the form can explain the problem where it occurred. */
export function validatePackageForm(form: FormState, t: Translate): FieldErrors {
  const errors: FieldErrors = {};
  if (form.nameAr.trim() === "") errors.nameAr = t("package.err.nameRequired");
  if (form.nameEn.trim() === "") errors.nameEn = t("package.err.nameRequired");
  for (const [field, price] of Object.entries(form.prices) as [PriceField, string][]) {
    const value = price.trim();
    if (value !== "" && !MONEY_INPUT.test(value)) {
      errors[field] = t("package.err.priceFormat");
    }
  }
  if (form.offerOn) {
    const percentText = form.offerPercent.trim();
    const percent = Number(percentText);
    if (!PERCENT.test(percentText) || !(percent > 0 && percent <= 100)) {
      errors.offerPercent = t("package.err.percentField");
    }
    const endsAt = form.offerEndsAt.trim();
    if (endsAt !== "" && !DATE_ONLY.test(endsAt)) {
      errors.offerEndsAt = t("package.err.dateField");
    }
  }
  return errors;
}
