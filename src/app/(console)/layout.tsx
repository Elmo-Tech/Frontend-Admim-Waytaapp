import { ConsoleShell } from "@/components/layout/ConsoleShell";
import { SessionBoundary } from "@/components/layout/SessionBoundary";
import type { ReactNode } from "react";

export default function ConsoleLayout({ children }: { children: ReactNode }) {
  return <SessionBoundary>{admin => <ConsoleShell admin={admin}>{children}</ConsoleShell>}</SessionBoundary>;
}
