import { SessionBoundary } from "@/components/layout/SessionBoundary";
import type { ReactNode } from "react";

export default function PrintLayout({ children }: { children: ReactNode }) {
  return <SessionBoundary>{() => <>{children}</>}</SessionBoundary>;
}
