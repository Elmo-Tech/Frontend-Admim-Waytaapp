"use client";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Alert, Badge, Button, Card, CardHeader, Input, Label, Skeleton } from "@/components/ui";
import { IconArrowLeft } from "@/components/ui/icons";
import { FEATURE_KEYS, isDisplayOnly, OPT_IN_FEATURES, ORDERING_GROUP } from "@/lib/permissions/features";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { usePackageEditor } from "../hooks/use-package-editor";
import { FieldError } from "./FieldError";
import { PackageFeatureGroup } from "./PackageFeatures";
export function PackageEditor({ packageId }: { packageId: string | null }) {
  const { retryLoad, t, fmt, locale, router, creating, pkg, form, failure, busy, notice, problem, fieldErrors, confirmingDelete, setConfirmingDelete, set, setPrice, submit, changeStatus, remove } = usePackageEditor(packageId);
  const back = (
    <Link href="/packages" className="mb-4 inline-flex items-center gap-2 text-sm text-primary-text hover:underline">
      <IconArrowLeft className="rtl:rotate-180" width={16} height={16} />
      {t("package.back")}
    </Link>
  );

  if (failure === "notFound") {
    return (
      <>
        {back}
        <Alert tone="warning">{t("package.notFound")}</Alert>
      </>
    );
  }
  if (failure === "error") return (
    <div className="space-y-3">
      <Alert tone="danger">{t("common.error")}</Alert>
      <Button onClick={retryLoad}>{t("common.retry")}</Button>
    </div>
  );
  if (!creating && !pkg) {
    return (
      <div className="space-y-4" aria-busy="true">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const inUse = (pkg?.restaurantCount ?? 0) > 0;

  return (
    <>
      {back}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-[22px] font-semibold tracking-tight">
          {creating ? t("package.newTitle") : <bdi>{locale === "ar" ? pkg?.nameAr : pkg?.nameEn}</bdi>}
        </h1>
        {pkg?.status === "ARCHIVED" ? <Badge tone="warning">{t("packages.status.ARCHIVED")}</Badge> : null}
      </div>

      {notice ? <Alert tone="success" className="mb-4">{t(notice)}</Alert> : null}
      {problem ? <Alert tone="danger" className="mb-4">{problem}</Alert> : null}
      {!creating && inUse ? (
        <Alert tone="info" className="mb-4">
          {t("package.editingLive", { count: fmt.number(pkg?.restaurantCount ?? 0) })}
        </Alert>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-3">
        <form onSubmit={(event) => void submit(event)} className="space-y-6 xl:col-span-2" noValidate>
          <Card>
            <CardHeader title={t("package.details")} />
            <div className="space-y-4 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="package-name-ar">{t("package.nameAr")}</Label>
                  <Input
                    id="package-name-ar"
                    dir="rtl"
                    value={form.nameAr}
                    onChange={(event) => set("nameAr", event.target.value)}
                    placeholder={t("package.nameArPlaceholder")}
                    maxLength={80}
                    required
                    aria-invalid={Boolean(fieldErrors.nameAr)}
                    aria-describedby={fieldErrors.nameAr ? "package-name-ar-error" : undefined}
                    className={cn(fieldErrors.nameAr && "border-danger focus:border-danger focus:ring-danger/25")}
                  />
                  <FieldError controlId="package-name-ar" message={fieldErrors.nameAr} />
                </div>
                <div>
                  <Label htmlFor="package-name-en">{t("package.nameEn")}</Label>
                  <Input
                    id="package-name-en"
                    dir="ltr"
                    value={form.nameEn}
                    onChange={(event) => set("nameEn", event.target.value)}
                    placeholder={t("package.nameEnPlaceholder")}
                    maxLength={80}
                    required
                    aria-invalid={Boolean(fieldErrors.nameEn)}
                    aria-describedby={fieldErrors.nameEn ? "package-name-en-error" : undefined}
                    className={cn(fieldErrors.nameEn && "border-danger focus:border-danger focus:ring-danger/25")}
                  />
                  <FieldError controlId="package-name-en" message={fieldErrors.nameEn} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="package-description-ar">{t("package.descriptionAr")}</Label>
                  <textarea
                    id="package-description-ar"
                    dir="rtl"
                    value={form.descriptionAr}
                    onChange={(event) => set("descriptionAr", event.target.value)}
                    maxLength={500}
                    rows={3}
                    className="w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/25"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">{t("package.descriptionArHint")}</p>
                </div>
                <div>
                  <Label htmlFor="package-description-en">{t("package.descriptionEn")}</Label>
                  <textarea
                    id="package-description-en"
                    dir="ltr"
                    value={form.descriptionEn}
                    onChange={(event) => set("descriptionEn", event.target.value)}
                    maxLength={500}
                    rows={3}
                    className="w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/25"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">{t("package.descriptionEnHint")}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title={t("package.prices")} description={t("package.pricesHint")} />
            <div className="space-y-5 p-5">
              {(
                [
                  ["package.priceEgp", "egpMonthly", "egpYearly", "EGP"],
                  ["package.priceUsd", "usdMonthly", "usdYearly", "USD"],
                ] as const
              ).map(([title, monthly, yearly, currency]) => (
                <div key={currency}>
                  <p className="mb-2 text-[13px] font-semibold text-foreground">{t(title)}</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {([[monthly, "package.monthly"], [yearly, "package.yearly"]] as const).map(([field, label]) => (
                      <div key={field}>
                        <Label htmlFor={`package-${field}`}>{t(label)}</Label>
                        <div className="relative">
                          <Input
                            id={`package-${field}`}
                            dir="ltr"
                            inputMode="decimal"
                            value={form.prices[field]}
                            onChange={(event) => setPrice(field, event.target.value)}
                            placeholder="0.00"
                            aria-invalid={Boolean(fieldErrors[field])}
                            aria-describedby={fieldErrors[field] ? `package-${field}-error` : undefined}
                            className={cn(
                              "pe-14 text-start",
                              fieldErrors[field] && "border-danger focus:border-danger focus:ring-danger/25",
                            )}
                          />
                          <span
                            dir="ltr"
                            className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground"
                          >
                            {currency}
                          </span>
                        </div>
                        <FieldError controlId={`package-${field}`} message={fieldErrors[field]} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title={t("package.offer")} description={t("package.offerHint")} />
            <div className="space-y-4 p-5">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.offerOn}
                  onChange={(event) => set("offerOn", event.target.checked)}
                  className="size-4 shrink-0 accent-primary"
                />
                <span className="text-sm font-medium text-foreground">{t("package.offerOn")}</span>
                {pkg?.offer && !pkg.offer.active ? <Badge tone="neutral">{t("package.offerEnded")}</Badge> : null}
              </label>
              {form.offerOn ? (
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <Label htmlFor="package-offer-percent">{t("package.offerPercent")}</Label>
                    <Input
                      id="package-offer-percent"
                      dir="ltr"
                      inputMode="decimal"
                      value={form.offerPercent}
                      onChange={(event) => set("offerPercent", event.target.value)}
                      placeholder="20"
                      aria-invalid={Boolean(fieldErrors.offerPercent)}
                      aria-describedby={fieldErrors.offerPercent ? "package-offer-percent-error" : undefined}
                      className={cn(
                        "text-start",
                        fieldErrors.offerPercent && "border-danger focus:border-danger focus:ring-danger/25",
                      )}
                    />
                    <FieldError controlId="package-offer-percent" message={fieldErrors.offerPercent} />
                  </div>
                  <div>
                    <Label htmlFor="package-offer-label">{t("package.offerLabel")}</Label>
                    <Input
                      id="package-offer-label"
                      value={form.offerLabel}
                      onChange={(event) => set("offerLabel", event.target.value)}
                      placeholder={t("package.offerLabelPlaceholder")}
                      maxLength={60}
                    />
                  </div>
                  <div>
                    <Label htmlFor="package-offer-ends">{t("package.offerEnds")}</Label>
                    <Input
                      id="package-offer-ends"
                      type="date"
                      dir="ltr"
                      value={form.offerEndsAt}
                      onChange={(event) => set("offerEndsAt", event.target.value)}
                      aria-invalid={Boolean(fieldErrors.offerEndsAt)}
                      aria-describedby={fieldErrors.offerEndsAt ? "package-offer-ends-error" : undefined}
                      className={cn(
                        "text-start",
                        fieldErrors.offerEndsAt && "border-danger focus:border-danger focus:ring-danger/25",
                      )}
                    />
                    <FieldError controlId="package-offer-ends" message={fieldErrors.offerEndsAt} />
                    <p className="mt-1 text-xs text-muted-foreground">{t("package.offerEndsHint")}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </Card>

          <Card>
            <CardHeader
              title={t("package.features")}
              description={t("package.featuresHint")}
              action={
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => set("features", FEATURE_KEYS.filter((key) => !OPT_IN_FEATURES.includes(key)))}
                  >
                    {t("package.selectAll")}
                  </Button>
                  <Button type="button" size="sm" onClick={() => set("features", [])}>
                    {t("package.clearAll")}
                  </Button>
                </div>
              }
            />
            <PackageFeatureGroup title={t("package.group.menu")} keys={FEATURE_KEYS.filter((key) => !ORDERING_GROUP.includes(key))} form={form} set={set} />
            <PackageFeatureGroup title={t("package.group.ordering")} keys={FEATURE_KEYS.filter((key) => ORDERING_GROUP.includes(key))} hint={t("package.orderingHint")} form={form} set={set} />
            {isDisplayOnly(form.features) ? (
              <p className="border-t border-border bg-success-soft px-5 py-3 text-[13px] font-medium text-success">
                {t("package.displayOnlyNote")}
              </p>
            ) : null}
          </Card>

          <div className="flex gap-3">
            <Button type="submit" variant="primary" disabled={busy}>
              {busy ? t("package.saving") : creating ? t("package.create") : t("package.save")}
            </Button>
            <Button type="button" onClick={() => router.push("/packages")} disabled={busy}>
              {t("common.cancel")}
            </Button>
          </div>
        </form>

        {pkg ? (
          <div className="space-y-6">
            <Card>
              <CardHeader title={t("package.status")} description={t("package.statusHint")} />
              <div className="p-5">
                <Button className="w-full" onClick={() => void changeStatus()} disabled={busy}>
                  {pkg.status === "ACTIVE" ? t("package.archive") : t("package.unarchive")}
                </Button>
              </div>
            </Card>

            <Card>
              <CardHeader title={t("package.restaurantsOn")} />
              {pkg.restaurants.length === 0 ? (
                <p className="px-5 py-6 text-sm text-muted-foreground">{t("package.noRestaurants")}</p>
              ) : (
                <ul className="divide-y divide-border">
                  {pkg.restaurants.map((restaurant) => (
                    <li key={restaurant.id} className="flex items-center justify-between gap-3 px-5 py-3">
                      <Link href={`/restaurants/${restaurant.id}`} className="min-w-0 truncate text-sm text-primary-text hover:underline">
                        <bdi>{restaurant.name}</bdi>
                      </Link>
                      <StatusBadge status={restaurant.status} t={t} />
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card>
              <CardHeader title={t("package.delete")} description={t("package.deleteHint")} />
              <div className="space-y-3 p-5">
                {confirmingDelete ? (
                  <>
                    <Alert tone="warning">
                      {t("package.deleteConfirm", { name: locale === "ar" ? pkg.nameAr : pkg.nameEn })}
                    </Alert>
                    <div className="flex gap-2">
                      <Button variant="danger" onClick={() => void remove()} disabled={busy}>
                        {t("detail.confirm")}
                      </Button>
                      <Button onClick={() => setConfirmingDelete(false)} disabled={busy}>
                        {t("common.cancel")}
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button className="w-full" onClick={() => setConfirmingDelete(true)} disabled={busy || inUse}>
                    {t("package.delete")}
                  </Button>
                )}
              </div>
            </Card>
          </div>
        ) : null}
      </div>
    </>
  );
}
