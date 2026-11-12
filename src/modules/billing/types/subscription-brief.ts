
/** Where a restaurant's subscription stands today (DEC-049). */
export interface SubscriptionBrief {
  kind: "PAID" | "TRIAL";
  phase: "ACTIVE" | "GRACE" | "EXPIRED" | "UPCOMING" | "CANCELLED";
  daysLeft: number;
  graceDaysLeft: number;
  endsAt: string;
  packageName: string;
  period: "MONTHLY" | "YEARLY" | null;
  currencyCode: string;
  balance: string;
  paymentStatus: string;
}
