"use client";
import { reopenContract, uploadContractAsset, writeContract } from "../api/contracts";

import type { Locale } from "@/lib/i18n/locale";
import type { ContractData } from "@/modules/billing";
import {
  initialContractFields,
  legacyDefaultText,
  parseContract,
  parseLegacyContractText,
  serializeContract,
  type ContractFields
} from "@/modules/contracts/utils/contract-document-model";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent } from "react";

export function useContractEditor(data: ContractData, locale: Locale) {
  const router = useRouter();
  const ar = locale === "ar";
  const copy = (arabic: string, english: string) => (ar ? arabic : english);
  const previousFields = parseContract(data.documentText);
  const previousLegacyText = parseLegacyContractText(data.documentText);
  const legacyMode =
    previousLegacyText !== null ||
    (data.documentText !== null &&
      previousFields === null &&
      data.documentText !== legacyDefaultText(data, locale));
  const [fields, setFields] = useState<ContractFields>(
    () => previousFields ?? initialContractFields(data, locale),
  );
  const [legacyText, setLegacyText] = useState(
    previousLegacyText ?? (legacyMode ? (data.documentText ?? "") : ""),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [revision, setRevision] = useState(data.revision);
  const [assets, setAssets] = useState(data.assets);
  async function write(issue: boolean) {
    const text = serializeContract(fields, legacyMode ? legacyText : undefined);
    if ((legacyMode && !legacyText.trim()) || text.length > 20000) {
      setError(
        copy(
          "راجع نص العقد؛ يجب ألا يتجاوز ٢٠ ألف حرف.",
          "Check the document text; it must be at most 20,000 characters.",
        ),
      );
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await writeContract(data.subscriptionId, issue, { revision, locale, text });
      if (issue) router.refresh();
      else {
        setRevision((value) => value + 1);
        setMessage(copy("تم حفظ المسودة.", "Draft saved."));
      }
    } catch {
      setError(
        copy(
          "تعذر الحفظ. قد يكون العقد تغيّر؛ أعد تحميل الصفحة وحاول مجددًا.",
          "Could not save. The contract may have changed; reload and try again.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }

  async function reopen() {
    setBusy(true);
    setError("");
    try {
      await reopenContract(data.subscriptionId);
      router.refresh();
    } catch {
      setError(
        copy("تعذر إعادة العقد لمسودة.", "Could not reopen the contract."),
      );
    } finally {
      setBusy(false);
    }
  }

  async function upload(
    kind: "seal" | "signature",
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (
      file.size > 1024 * 1024 ||
      !["image/png", "image/jpeg", "image/webp"].includes(file.type)
    ) {
      setError(
        copy(
          "استخدم صورة PNG أو JPEG أو WebP بحجم لا يزيد عن 1 ميجابايت.",
          "Use a PNG, JPEG or WebP image up to 1 MB.",
        ),
      );
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const body = new FormData();
      body.append("image", file);
      body.append("revision", String(revision));
      const response = await uploadContractAsset(data.subscriptionId, kind, body);
      if (response.status === 409) throw new Error("CONFLICT");
      if (!response.ok) throw new Error("UPLOAD_FAILED");
      setRevision((value) => value + 1);
      const source = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () =>
          typeof reader.result === "string"
            ? resolve(reader.result)
            : reject(new Error("READ_FAILED"));
        reader.onerror = () => reject(new Error("READ_FAILED"));
        reader.readAsDataURL(file);
      });
      setAssets((current) => ({ ...current, [kind]: source }));
      setMessage(
        copy(
          "تم حفظ الصورة في هذا العقد فقط.",
          "Image saved only in this contract.",
        ),
      );
    } catch (caught) {
      setError(
        caught instanceof Error && caught.message === "CONFLICT"
          ? copy(
            "العقد اتغيّر؛ أعد تحميل الصفحة قبل رفع الصورة.",
            "The contract changed; reload before uploading.",
          )
          : copy(
            "تعذر رفع الصورة أو عرضها. أعد تحميل الصفحة وحاول مجددًا.",
            "Could not upload or display the image. Reload and try again.",
          ),
      );
    } finally {
      setBusy(false);
    }
  }


  return { ar, copy, legacyMode, fields, setFields, legacyText, setLegacyText, busy, error, message, assets, write, reopen, upload };
}
