import { Badge } from "@/components/ui";
import type { Translate } from "@/lib/i18n/translate";

export function StatusBadge({ status, t }: { status: "ACTIVE" | "INACTIVE" | "SUSPENDED"; t: Translate }) {
  return (
    <Badge tone={status === "ACTIVE" ? "success" : status === "SUSPENDED" ? "danger" : "neutral"} dot>
      {t(`status.${status}`)}
    </Badge>
  );
}
