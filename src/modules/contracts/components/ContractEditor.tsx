"use client";
import type { Locale } from "@/lib/i18n/locale";
import type { ContractData } from "@/modules/billing";
import { ContractPreview } from "@/modules/contracts/components/ContractPreview";
import { useContractEditor } from "../hooks/use-contract-editor";
import { ContractFieldsPanel } from "./ContractFieldsPanel";
export function ContractEditor({ data, locale }: { data: ContractData; locale: Locale }) {
  const editor = useContractEditor(data, locale);
  const { ar, copy, legacyMode, fields, legacyText, busy, error, message, assets, write, reopen } = editor;
  if (!data.isDraft && !data.documentText)
    return (
      <div
        dir={ar ? "rtl" : "ltr"}
        className="mx-auto max-w-[210mm] rounded-xl bg-white p-5 text-slate-900 print:hidden"
      >
        <p className="font-semibold">{copy("عقد صادر", "Issued contract")}</p>
        <button
          type="button"
          disabled={busy}
          onClick={() => void reopen()}
          className="mt-3 rounded-lg border border-slate-300 px-4 py-2 text-sm"
        >
          {copy("إعادة لمسودة وتعديل", "Reopen as draft")}
        </button>
        {error ? (
          <p role="alert" className="mt-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
      </div>
    );

  return (
    <main
      dir={ar ? "rtl" : "ltr"}
      className="mx-auto max-w-[1540px] px-4 pb-12 print:max-w-none print:p-0"
    >
      {data.isDraft ? (
        <header className="mx-auto mb-6 flex max-w-[1440px] flex-wrap items-end justify-between gap-4 border-b border-slate-300 pb-5 print:hidden">
          <div>
            <p className="text-xs font-bold tracking-wide text-indigo-700">
              {copy("العقود / مسودة", "CONTRACTS / DRAFT")}
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-950">
              {copy("تجهيز عقد الاشتراك", "Prepare subscription agreement")}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {copy(
                "راجع البيانات وشاهد شكل العقد قبل إصداره.",
                "Review the details and preview the agreement before issuing.",
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href="#contract-preview"
              className="flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 hover:bg-slate-50 xl:hidden"
            >
              {copy("معاينة العقد", "Preview agreement")}
            </a>
            <button
              type="button"
              disabled={busy}
              onClick={() => void write(false)}
              className="min-h-11 rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
            >
              {copy("حفظ المسودة", "Save draft")}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void write(true)}
              className="min-h-11 rounded-lg bg-indigo-700 px-5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-50"
            >
              {copy("إصدار العقد", "Issue contract")}
            </button>
          </div>
        </header>
      ) : (
        <div className="mx-auto mb-4 max-w-[210mm] rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-700 print:hidden">
          {copy("عقد صادر", "Issued contract")}
        </div>
      )}
      {message ? (
        <p
          role="status"
          className="mx-auto mb-4 max-w-[1440px] rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 print:hidden"
        >
          {message}
        </p>
      ) : null}
      {error ? (
        <p
          role="alert"
          className="mx-auto mb-4 max-w-[1440px] rounded-lg bg-red-50 p-3 text-sm text-red-800 print:hidden"
        >
          {error}
        </p>
      ) : null}
      <div
        className={`mx-auto max-w-[1440px] ${data.isDraft ? "grid items-start gap-6 xl:grid-cols-[minmax(330px,440px)_minmax(0,1fr)]" : ""} print:block`}
      >
        {data.isDraft ? (
          <ContractFieldsPanel editor={editor} locale={locale} />
        ) : null}
        <div id="contract-preview" className="min-w-0">
          <div className="mx-auto mb-3 flex max-w-[210mm] items-center justify-between text-xs font-semibold text-slate-600 print:hidden">
            <span>{copy("معاينة العقد", "Agreement preview")}</span>
            <span dir="ltr">A4</span>
          </div>
          <ContractPreview
            fields={fields}
            locale={locale}
            assets={assets}
            {...(legacyMode ? { legacyText } : {})}
          />
        </div>
      </div>
    </main>
  );
}
