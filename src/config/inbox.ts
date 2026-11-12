import type { InboxStatus } from "@/types/inbox";

export const STATUS_TONE: Record<InboxStatus, "primary" | "warning" | "success" | "neutral"> = {
  NEW: "primary",
  CONTACTED: "warning",
  DONE: "success",
  DISMISSED: "neutral",
};

/** The next steps offered for each status. */
export const ACTIONS: Record<InboxStatus, { status: InboxStatus; label: "requests.act.contacted" | "requests.act.done" | "requests.act.dismiss" | "requests.act.reopen"; primary?: boolean }[]> = {
  NEW: [
    { status: "CONTACTED", label: "requests.act.contacted", primary: true },
    { status: "DONE", label: "requests.act.done" },
    { status: "DISMISSED", label: "requests.act.dismiss" },
  ],
  CONTACTED: [
    { status: "DONE", label: "requests.act.done", primary: true },
    { status: "DISMISSED", label: "requests.act.dismiss" },
  ],
  DONE: [{ status: "NEW", label: "requests.act.reopen" }],
  DISMISSED: [{ status: "NEW", label: "requests.act.reopen" }],
};

