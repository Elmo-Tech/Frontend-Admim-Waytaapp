import { platformServerGet } from "../../src/lib/api/server-fetch";
import { headers } from "next/headers";

jest.mock("next/headers", () => ({ headers: jest.fn() }));
jest.mock("@/config/server-api", () => ({ SERVER_PLATFORM_API: "http://api.internal:4000/api/v1/platform" }));

beforeEach(() => {
  jest.mocked(headers).mockResolvedValue(new Headers({ cookie: "platform_session=opaque-test", "x-forwarded-for": "192.0.2.10" }));
});
afterEach(() => jest.restoreAllMocks());

it("keeps session cookies, forwarded IP and no-store reads on the private server endpoint", async () => {
  const fetch = jest.spyOn(globalThis, "fetch").mockResolvedValue(new Response('{"data":{"id":"admin"}}'));
  expect(await platformServerGet("/auth/me")).toEqual({ ok: true, data: { id: "admin" } });
  expect(fetch).toHaveBeenCalledWith("http://api.internal:4000/api/v1/platform/auth/me", {
    method: "GET", cache: "no-store", headers: { cookie: "platform_session=opaque-test", "x-forwarded-for": "192.0.2.10" },
  });
});

it.each([401, 403, 500])("does not collapse HTTP %s into network failure or successful data", async status => {
  jest.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status }));
  expect(await platformServerGet("/auth/me")).toEqual({ ok: false, status });
});

it("keeps an unreachable API distinct from a signed-out administrator", async () => {
  jest.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("offline"));
  expect(await platformServerGet("/auth/me")).toEqual({ ok: false, status: null });
});
