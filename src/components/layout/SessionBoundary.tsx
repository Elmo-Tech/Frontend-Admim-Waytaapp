import { Alert } from "@/components/ui";
import { getPlatformSession } from "@/lib/auth/server";
import type { Admin } from "@/lib/auth/types";
import { getI18n } from "@/lib/i18n/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

/** Only a real 401 redirects. Network/server failures keep the existing unreachable state. */
export async function SessionBoundary({ children }: { children: (admin: Admin) => ReactNode }) {
  const me = await getPlatformSession();
  if (!me.ok && me.status === 401) redirect("/login");
  if (!me.ok) {
    const { t } = await getI18n();
    return (
      <main className="mx-auto max-w-lg px-6 py-20">
        <Alert tone="danger">{t("common.unreachable")}</Alert>
      </main>
    );
  }
  return children(me.data);
}
