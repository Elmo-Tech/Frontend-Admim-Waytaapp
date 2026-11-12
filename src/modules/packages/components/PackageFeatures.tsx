import { Badge } from "@/components/ui";
import { useI18n } from "@/lib/i18n/client";
import { type FeatureKey } from "@/lib/permissions/features";
import { cn } from "@/lib/utils/cn";
import { PREMIUM_TEMPLATES, STANDARD_TEMPLATES, type PackageTemplate } from "@/modules/packages/constants/templates";
import { templateCounts, type FormState } from "../utils/package-form";
interface FeatureProps { form: FormState; set: <K extends keyof FormState>(key: K, value: FormState[K]) => void; }

function PackageTemplatePanel({ form, set }: FeatureProps) {
  const { t, fmt } = useI18n();
  const toggleIn = (field: "standard" | "premium", key: PackageTemplate) =>
    set(field, form[field].includes(key) ? form[field].filter((item) => item !== key) : [...form[field], key]);


  const counts = templateCounts(form);
  const tierBox = (
    title: string,
    hint: string,
    modes: { value: string; label: string; checked: boolean; onSelect: () => void }[],
    keys: readonly PackageTemplate[],
    field: "standard" | "premium",
    showKeys: boolean,
    lead?: string,
  ) => (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <p className="mt-0.5 text-[13px] text-muted-foreground">{hint}</p>
      <div role="radiogroup" aria-label={title} className="mt-3 flex flex-wrap gap-2">
        {modes.map((mode) => (
          <label
            key={mode.value}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
              mode.checked ? "border-primary bg-primary-soft text-primary-text" : "border-border text-foreground hover:bg-surface-2",
            )}
          >
            <input type="radio" name={`tpl-${field}`} checked={mode.checked} onChange={mode.onSelect} className="sr-only" />
            {mode.label}
          </label>
        ))}
      </div>
      {showKeys ? (
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {lead ? (
            <li>
              <label className="flex items-center gap-3 rounded-lg border border-border bg-surface-2/60 px-4 py-2.5 text-sm text-muted-foreground">
                <input type="checkbox" checked disabled className="size-4 shrink-0 accent-primary" />
                {lead}
              </label>
            </li>
          ) : null}
          {keys.map((key) => (
            <li key={key}>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-4 py-2.5 text-sm text-foreground hover:bg-surface-2/60">
                <input
                  type="checkbox"
                  checked={form[field].includes(key)}
                  onChange={() => toggleIn(field, key)}
                  className="size-4 shrink-0 accent-primary"
                />
                {t(`template.${key}`)}
              </label>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );

  return (
    <div className="space-y-3 border-t border-dashed border-border bg-surface-2/40 px-5 py-4 ps-12">
      <p className="text-[13px] text-muted-foreground">{t("package.templatesHint")}</p>
      {tierBox(
        t("package.templatesStandard"),
        t("package.templatesStandardHint"),
        [
          { value: "all", label: t("package.tplAllStandard"), checked: form.standardAll, onSelect: () => set("standardAll", true) },
          { value: "choose", label: t("package.tplChoose"), checked: !form.standardAll, onSelect: () => set("standardAll", false) },
        ],
        STANDARD_TEMPLATES,
        "standard",
        !form.standardAll,
        t("package.templatesClassic"),
      )}
      {tierBox(
        t("package.templatesPremium"),
        t("package.templatesPremiumHint"),
        [
          { value: "none", label: t("package.tplNone"), checked: form.premiumMode === "none", onSelect: () => set("premiumMode", "none") },
          { value: "choose", label: t("package.tplChoose"), checked: form.premiumMode === "choose", onSelect: () => set("premiumMode", "choose") },
          { value: "all", label: t("package.tplAllPremium"), checked: form.premiumMode === "all", onSelect: () => set("premiumMode", "all") },
        ],
        PREMIUM_TEMPLATES,
        "premium",
        form.premiumMode === "choose",
      )}
      <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
        {t("package.templatesGives")}
        <Badge tone="neutral">{t("package.templatesStandardCount", { count: fmt.number(counts.standard) })}</Badge>
        <Badge tone="primary">{t("package.templatesPremiumCount", { count: fmt.number(counts.premium) })}</Badge>
      </p>
    </div>
  );
}

export function PackageFeatureGroup({ title, keys, hint, form, set }: FeatureProps & { title: string; keys: FeatureKey[]; hint?: string }) {
  const { t } = useI18n();
  const toggleFeature = (key: FeatureKey) => set("features", form.features.includes(key) ? form.features.filter(f => f !== key) : [...form.features, key]);
  return (
    <div key={title} className="border-t border-border first:border-t-0">
      <div className="bg-surface-2/60 px-5 py-2.5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
        {hint ? <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      <ul className="divide-y divide-border">
        {keys.map((key) => (
          <li key={key}>
            <label className="flex cursor-pointer items-start gap-3 px-5 py-4 hover:bg-surface-2/60">
              <input
                type="checkbox"
                checked={form.features.includes(key)}
                onChange={() => toggleFeature(key)}
                className="mt-0.5 size-4 shrink-0 accent-primary"
              />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-foreground">{t(`feature.${key}`)}</span>
                <span className="mt-0.5 block text-[13px] text-muted-foreground">{t(`feature.${key}.hint`)}</span>
              </span>
            </label>
            {key === "MENU_TEMPLATES" && form.features.includes(key) ? <PackageTemplatePanel form={form} set={set} /> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
