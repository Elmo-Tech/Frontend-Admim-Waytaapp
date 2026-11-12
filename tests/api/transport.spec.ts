import { platformFetch } from "../../src/lib/api/client";
import { ApiError } from "../../src/lib/api/errors";
import { apiErrorKey } from "../../src/lib/api/error-key";

jest.mock("@/config/api", () => ({ PLATFORM_API: "https://console.example.test/api/v1/platform" }));

afterEach(() => jest.restoreAllMocks());

it("keeps browser credentials and exact JSON mutation payloads", async () => {
  const fetch = jest.spyOn(globalThis, "fetch").mockResolvedValue(new Response('{"data":{"amount":"0.10"}}'));
  const result = await platformFetch("/example", { method: "PUT", body: { amount: "0.10", note: null } });
  expect(fetch).toHaveBeenCalledWith("https://console.example.test/api/v1/platform/example", {
    method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: '{"amount":"0.10","note":null}',
  });
  expect(result).toEqual({ data: { amount: "0.10" } });
});

it("keeps empty 204 responses distinct from JSON envelopes", async () => {
  jest.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));
  await expect(platformFetch("/auth/logout", { method: "POST" })).resolves.toBeUndefined();
});

it("preserves server refusal codes and field problems", async () => {
  jest.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ error: { code: "INVALID", message: "Refused", problems: ["Field", 1] } }), { status: 400 }));
  await expect(platformFetch("/example")).rejects.toMatchObject({ status: 400, code: "INVALID", message: "Refused", problems: ["Field"] });
});

it("keeps network, expired-session and generic errors separate", () => {
  expect(apiErrorKey(new TypeError("offline"))).toBe("common.unreachable");
  expect(apiErrorKey(new ApiError(401, null))).toBe("common.sessionExpired");
  expect(apiErrorKey(new ApiError(403, null))).toBe("common.error");
});
