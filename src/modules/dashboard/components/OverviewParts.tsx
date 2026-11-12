import { Badge, Card } from "@/components/ui";
import { createFormatters } from "@/lib/i18n/translate";
import { cn } from "@/lib/utils/cn";
import { type MoneyTotal } from "@/modules/dashboard/types/overview";
import Link from "next/link";
import type { ReactNode } from "react";
type Fmt = ReturnType<typeof createFormatters>;

export function Kpi({
  label,
  hint,
  href,
  tone = "neutral",
  children,
}: {
  label: string;
  hint?: string;
  href?: string;
  tone?: "neutral" | "success" | "warning" | "primary";
  children: ReactNode;
}) {
  const accent =
    tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : tone === "primary" ? "text-primary-text" : "text-foreground";
  const body = (
    <Card className={cn("h-full p-5", href && "transition-shadow hover:shadow-pop")}>
      <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
      <div className={cn("tabular mt-2 space-y-0.5 text-[26px] font-semibold leading-tight tracking-tight", accent)}>{children}</div>
      {hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
    </Card>
  );
  return href ? (
    <Link href={href} className="block">
      {body}
    </Link>
  ) : (
    body
  );
}

export function MoneyLines({ totals, fmt }: { totals: MoneyTotal[]; fmt: Fmt }) {
  if (totals.length === 0) return <p className="text-muted-foreground">—</p>;
  return (
    <>
      {totals.map((total) => (
        <p key={total.currencyCode}>
          <bdi dir="ltr">
            {fmt.money(total.amount)} <span className="text-sm font-medium opacity-70">{total.currencyCode}</span>
          </bdi>
        </p>
      ))}
    </>
  );
}

export function AttentionColumn({
  title,
  count,
  empty,
  children,
}: {
  title: string;
  count: number;
  empty: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
        {count > 0 ? <Badge tone="warning">{count}</Badge> : null}
      </div>
      {count === 0 ? <p className="text-sm text-muted-foreground">{empty}</p> : <ul className="space-y-1">{children}</ul>}
    </div>
  );
}

export function RowLink({ href, title, meta, end }: { href: string; title: ReactNode; meta?: ReactNode; end?: ReactNode }) {
  return (
    <li>
      <Link href={href} className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-2">
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-foreground">{title}</span>
          {meta ? <span className="block truncate text-xs text-muted-foreground">{meta}</span> : null}
        </span>
        {end ? <span className="shrink-0 text-end text-[13px] font-medium">{end}</span> : null}
      </Link>
    </li>
  );
}
