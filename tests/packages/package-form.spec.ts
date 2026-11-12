import { EMPTY, formFrom, toInput, validatePackageForm, type FormState } from "../../src/modules/packages/utils/package-form";
import type { PackageDetail } from "../../src/modules/packages/types/package";
import { createTranslate } from "../../src/lib/i18n/translate";

const t = createTranslate("en");
const form = (overrides: Partial<FormState> = {}): FormState => ({
  ...EMPTY, nameAr: "اسم", nameEn: "Name", prices: { ...EMPTY.prices }, ...overrides,
});

describe("package editing compatibility", () => {
  it("keeps money as exact strings and preserves null versus omitted API fields", () => {
    const input = toInput(form({
      nameAr: "  اسم  ", nameEn: "  Name  ", descriptionAr: "  وصف  ",
      prices: { egpMonthly: " 1,234.50 ", egpYearly: "9999999999.99", usdMonthly: "", usdYearly: "0.00" },
      offerOn: true, offerPercent: " 12.50 ", offerLabel: " ", offerEndsAt: "2026-12-31",
      features: ["MENU_IMPORT", "WHATSAPP_ORDERING"],
    }));
    expect(input).toEqual({
      nameAr: "اسم", nameEn: "Name", descriptionAr: "وصف", descriptionEn: null,
      prices: { egpMonthly: "1234.50", egpYearly: "9999999999.99", usdMonthly: null, usdYearly: "0.00" },
      offer: { percent: "12.50", label: null, endsAt: "2026-12-31" },
      templates: { all: true, allStandard: false, selected: [] },
      features: ["WHATSAPP_ORDERING", "MENU_IMPORT"],
    });
    expect(input).not.toHaveProperty("status");
  });

  it.each(["12,34", "1.234", "-1", "1e3", "12345678901"])("retains rejection of invalid price %s", price => {
    expect(validatePackageForm(form({ prices: { ...EMPTY.prices, egpMonthly: price } }), t)).toHaveProperty("egpMonthly");
  });

  it.each(["0", "100.01", "1e2", "-1", "1.001"])("retains offer percentage validation for %s", offerPercent => {
    expect(validatePackageForm(form({ offerOn: true, offerPercent }), t)).toHaveProperty("offerPercent");
  });

  it("keeps field-validation/focus order and ignores disabled offer fields", () => {
    const errors = validatePackageForm(form({ nameAr: " ", nameEn: "", prices: { ...EMPTY.prices, egpMonthly: "bad" } }), t);
    expect(Object.keys(errors)).toEqual(["nameAr", "nameEn", "egpMonthly"]);
    expect(validatePackageForm(form({ offerOn: false, offerPercent: "bad", offerEndsAt: "bad" }), t)).toEqual({});
  });

  it("retains selected design tiers and the ordering of the backend template vocabulary", () => {
    const selected = toInput(form({ standardAll: false, standard: ["EDITORIAL", "LIST"], premiumMode: "choose", premium: ["BREW", "GALLERY"] }));
    expect(selected.templates).toEqual({ all: false, allStandard: false, selected: ["LIST", "EDITORIAL", "GALLERY", "BREW"] });
    expect(toInput(form({ standardAll: true, premiumMode: "none" })).templates).toEqual({ all: false, allStandard: true, selected: [] });
  });

  it("reopens an existing package without changing prices, optional text or tier meaning", () => {
    const pkg: PackageDetail = {
      id: "package-1", name: "اسم", description: null, status: "ACTIVE", restaurantCount: 0,
      createdAt: "2026-11-12T10:00:00Z", updatedAt: "2026-11-12T10:00:00Z", restaurants: [],
      nameAr: "اسم", nameEn: "Name", descriptionAr: null, descriptionEn: "Description",
      prices: { egpMonthly: "0.00", egpYearly: null, usdMonthly: "19.99", usdYearly: null },
      offer: null, templates: { all: false, allStandard: true, selected: ["BREW"] }, features: ["MENU_TEMPLATES"],
    };
    const reopened = formFrom(pkg);
    expect(reopened.prices).toEqual({ egpMonthly: "0.00", egpYearly: "", usdMonthly: "19.99", usdYearly: "" });
    expect(reopened.premiumMode).toBe("choose");
    expect(toInput(reopened).templates).toEqual(pkg.templates);
    expect(toInput(reopened).offer).toBeNull();
  });
});
