import { directionOf, LOCALE_COOKIE, resolveLocale, type Locale } from "@/lib/i18n/locale";
import { createTranslate, type Translate } from "@/lib/i18n/translate";
import { cookies, headers } from "next/headers";

export async function getLocale(): Promise<Locale> {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  return resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value, headerStore.get("accept-language"));
}

/** Server Components: `const { t } = await getI18n();` */
export async function getI18n(): Promise<{ locale: Locale; dir: "ltr" | "rtl"; t: Translate }> {
  const locale = await getLocale();
  return { locale, dir: directionOf(locale), t: createTranslate(locale) };
}
