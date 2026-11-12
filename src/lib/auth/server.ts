import { platformServerGet } from "@/lib/api/server-fetch";
import type { Admin } from "./types";

export const getPlatformSession = () => platformServerGet<Admin>("/auth/me");
