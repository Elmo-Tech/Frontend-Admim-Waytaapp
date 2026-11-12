import { apiBasePath, apiUrl } from "./api";

/**
 * Where SERVER-SIDE code reaches the API. Production sets `API_INTERNAL_URL` (for example `http://api:4000`) so
 * the Next.js server calls the API over the private network instead of going out through the public proxy; it
 * is server-only and runtime-only (not a `NEXT_PUBLIC_*` variable, so never inlined into browser code). Unset,
 * the public URL is used (local development).
 */
const internalUrl = typeof window === "undefined" ? process.env.API_INTERNAL_URL : undefined;
export const SERVER_PLATFORM_API = `${internalUrl ? internalUrl.replace(/\/+$/, "") : apiUrl}${apiBasePath}/platform`;
