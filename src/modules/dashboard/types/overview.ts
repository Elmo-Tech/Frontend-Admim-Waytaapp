import type { AuditEntry } from "@/modules/activity";
import type { RestaurantStatus } from "@/types/restaurant";

export interface MoneyTotal {
  currencyCode: string;
  amount: string;
}

export interface Overview {
  restaurants: { total: number; active: number; suspended: number; inactive: number };
  last30Days: { newRestaurants: number; orders: number };
  totals: { branches: number; products: number; orders: number };
  restrictedRestaurants: number;
  /** Upgrade and renewal requests nobody has finished yet (DEC-050). */
  openRequests: number;
  /** Landing page requests nobody has finished yet (DEC-053). */
  openLeads: number;
  billing: {
    ending: {
      restaurantId: string;
      restaurantName: string;
      packageName: string;
      phase: "ACTIVE" | "GRACE";
      daysLeft: number;
      graceDaysLeft: number;
      endsAt: string;
    }[];
    unpaid: { restaurantId: string; restaurantName: string; packageName: string; currencyCode: string; balance: string }[];
    unpaidCount: number;
    outstanding: MoneyTotal[];
    received30d: MoneyTotal[];
  };
  recentRestaurants: { id: string; name: string; status: RestaurantStatus; createdAt: string }[];
  recentActivity: AuditEntry[];
}
