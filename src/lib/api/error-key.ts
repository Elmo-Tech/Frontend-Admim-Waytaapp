import type { MessageKey } from "@/lib/i18n/messages";
import { ApiError, isNetworkFailure } from "./errors";

export function apiErrorKey(error: unknown): MessageKey {
  return isNetworkFailure(error) ? "common.unreachable"
    : error instanceof ApiError && error.status === 401 ? "common.sessionExpired"
    : "common.error";
}
