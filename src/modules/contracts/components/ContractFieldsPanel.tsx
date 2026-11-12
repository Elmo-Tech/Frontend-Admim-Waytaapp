import type { Locale } from "@/lib/i18n/locale";
import {
  updateContractField,
  type ContractFields
} from "@/modules/contracts/utils/contract-document-model";
import { useContractEditor } from "../hooks/use-contract-editor";
import { Field, Group } from "./ContractEditorControls";
type EditorState = ReturnType<typeof useContractEditor>;
export function ContractFieldsPanel({ editor, locale }: { editor: EditorState; locale: Locale }) {
  const { copy, fields, setFields, legacyMode, legacyText, setLegacyText, assets, busy, upload } = editor;
  const field = (
    key: keyof ContractFields,
    label: string,
    options?: { multiline?: boolean; direction?: "ltr" },
  ) => (
    <Field
      key={key}
      label={label}
      value={fields[key]}
      onChange={(value) =>
        setFields((current) => updateContractField(current, key, value, locale))
      }
      {...options}
    />
  );


  return (
    <div className="space-y-4 print:hidden">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
        {copy(
          "تعديل العقد لا يغيّر الاشتراك أو المدفوعات. راجع المبالغ والتواريخ قبل الإصدار.",
          "Editing this document does not change the subscription or payments. Check amounts and dates before issuing.",
        )}
      </div>
      {!legacyMode ? (
        <>
          <Group
            title={copy("بيانات العقد والعميل", "Agreement and client")}
            description={copy(
              "البيانات الأساسية التي تظهر في بداية العقد.",
              "The details shown at the top of the agreement.",
            )}
          >
            {field("title", copy("عنوان العقد", "Agreement title"))}
            {field("number", copy("رقم العقد", "Agreement number"), {
              direction: "ltr",
            })}
            {field("date", copy("تاريخ العقد", "Agreement date"))}
            {field("provider", copy("اسم المزوّد", "Provider name"))}
            {field(
              "providerDescription",
              copy("وصف الخدمة", "Provider description"),
            )}
            {field("client", copy("اسم البراند", "Brand name"))}
            {field("contactName", copy("اسم المسؤول", "Contact person"))}
            {field("contactPhone", copy("رقم الهاتف", "Telephone"), {
              direction: "ltr",
            })}
            {field("email", copy("البريد الإلكتروني", "Email"), {
              direction: "ltr",
            })}
            {field("menuUrl", copy("رابط المنيو", "Menu link"), {
              direction: "ltr",
            })}
          </Group>
          <Group
            title={copy("الخدمة والمدة", "Service and period")}
            description={copy(
              "صياغة الاشتراك وتفاصيل الباقة كما ستظهر للعميل.",
              "The subscription wording and package details shown to the client.",
            )}
          >
            {field(
              "statement",
              copy("نص الاتفاق", "Agreement statement"),
              { multiline: true },
            )}
            {field("packageName", copy("الباقة", "Package"))}
            {field("features", copy("تشمل", "Includes"), {
              multiline: true,
            })}
            {field("period", copy("فترة الفوترة", "Billing period"))}
            <div className="grid gap-3 sm:grid-cols-2">
              {field("starts", copy("تاريخ البداية", "Start date"))}
              {field("ends", copy("تاريخ النهاية", "End date"))}
            </div>
            {field(
              "serviceStatement",
              copy("وصف تقديم الخدمة", "Service statement"),
              { multiline: true },
            )}
          </Group>
          <Group
            title={copy("القيمة والملاحظات", "Amount and notes")}
            description={copy(
              "القيم هنا تخص نسخة العقد القابلة للطباعة.",
              "These values appear on the printable agreement.",
            )}
          >
            {field("listPrice", copy("سعر الباقة", "Package price"), {
              direction: "ltr",
            })}
            {field("offerLabel", copy("اسم العرض", "Offer label"))}
            {field("offerAmount", copy("قيمة العرض", "Offer amount"), {
              direction: "ltr",
            })}
            {field("discount", copy("خصم العميل", "Customer discount"), {
              direction: "ltr",
            })}
            {field("total", copy("المبلغ المستحق", "Amount due"), {
              direction: "ltr",
            })}
            {field("notes", copy("ملاحظات", "Notes"), {
              multiline: true,
            })}
          </Group>
          <Group
            title={copy("بيانات الشركة", "Company details")}
            description={copy(
              "تظهر أسفل العقد بشكل مختصر ورسمي.",
              "Shown in the footer of the agreement.",
            )}
          >
            {field(
              "companyStatement",
              copy("تعريف الشركة", "Company statement"),
              { multiline: true },
            )}
            {field("waytaUrl", copy("رابط Wayta", "Wayta website"), {
              direction: "ltr",
            })}
            {field(
              "elmotechUrl",
              copy("رابط ElmoTech", "ElmoTech website"),
              { direction: "ltr" },
            )}
          </Group>
        </>
      ) : (
        <Group
          title={copy("نص العقد المحفوظ", "Saved agreement text")}
          description={copy(
            "هذا النص محفوظ من النسخة السابقة ويمكن تعديله كما هو.",
            "This text was saved in the previous editor and can be edited as-is.",
          )}
        >
          {field("title", copy("عنوان العقد", "Agreement title"))}
          {field("number", copy("رقم العقد", "Agreement number"), {
            direction: "ltr",
          })}
          {field("date", copy("تاريخ العقد", "Agreement date"))}
          {field("provider", copy("اسم المزوّد", "Provider name"))}
          {field(
            "client",
            copy("اسم العميل في التوقيع", "Client signature name"),
          )}
          <Field
            label={copy("نص العقد", "Agreement text")}
            value={legacyText}
            onChange={setLegacyText}
            multiline
          />
          {field(
            "companyStatement",
            copy("تعريف الشركة", "Company statement"),
            { multiline: true },
          )}
          {field("waytaUrl", copy("رابط Wayta", "Wayta website"), {
            direction: "ltr",
          })}
          {field(
            "elmotechUrl",
            copy("رابط ElmoTech", "ElmoTech website"),
            { direction: "ltr" },
          )}
        </Group>
      )}
      <Group
        title={copy("التوقيع والختم", "Signature and seal")}
        description={copy(
          "ارفع صور التوقيع والختم لهذا العقد؛ لن تُستخدم في العقود الأخرى.",
          "Upload the signature and seal for this contract; they are not used in other agreements.",
        )}
      >
        {(["signature", "seal"] as const).map((kind) => (
          <label
            key={kind}
            className="flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-800 hover:border-indigo-500"
          >
            <span>
              {kind === "signature"
                ? copy("صورة التوقيع", "Signature image")
                : copy("صورة الختم", "Seal image")}
              <span className="mt-1 block text-xs font-normal text-slate-500">
                {assets[kind]
                  ? copy(
                    "الصورة مرفوعة · اضغط للاستبدال",
                    "Uploaded · select to replace",
                  )
                  : copy(
                    "PNG أو JPG أو WebP · حتى 1 ميجابايت",
                    "PNG, JPG or WebP · up to 1 MB",
                  )}
              </span>
            </span>
            <span className="rounded-md bg-slate-100 px-3 py-1.5 text-xs">
              {copy("اختيار صورة", "Choose image")}
            </span>
            <input
              className="sr-only"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              disabled={busy}
              onChange={(event) => void upload(kind, event)}
            />
          </label>
        ))}
      </Group>
    </div>
  );
}
