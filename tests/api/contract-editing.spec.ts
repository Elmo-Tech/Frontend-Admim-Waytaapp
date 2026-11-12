import { platformFetch } from "../../src/lib/api/client";
import { reopenContract, uploadContractAsset, writeContract } from "../../src/modules/contracts/api/contracts";

jest.mock("@/lib/api/client", () => ({ platformFetch: jest.fn() }));
jest.mock("@/config/api", () => ({ PLATFORM_API: "https://console.example.test/api/v1/platform" }));

beforeEach(() => jest.clearAllMocks());
afterEach(() => jest.restoreAllMocks());

it.each([false, true])("preserves draft/issue revision, locale and exact saved text (issue=%s)", async issue => {
  const body = { revision: 4, locale: "ar" as const, text: 'صياغة العقد\n0.10 EGP' };
  await writeContract("id /?#", issue, body);
  expect(platformFetch).toHaveBeenCalledWith(`/subscriptions/id%20%2F%3F%23/contract/${issue ? "issue" : "draft"}`, { method: issue ? "POST" : "PUT", body });
});

it("reopens the same subscription without introducing a payload", async () => {
  await reopenContract("subscription-1");
  expect(platformFetch).toHaveBeenCalledWith("/subscriptions/subscription-1/contract/reopen", { method: "POST" });
});

it("retains multipart credentials and lets the browser set Content-Type", async () => {
  const response = new Response(null, { status: 204 });
  const fetch = jest.spyOn(globalThis, "fetch").mockResolvedValue(response);
  const body = new FormData();
  body.append("revision", "4");
  expect(await uploadContractAsset("id /?#", "signature", body)).toBe(response);
  expect(fetch).toHaveBeenCalledWith("https://console.example.test/api/v1/platform/subscriptions/id%20%2F%3F%23/contract/images/signature", { method: "PUT", credentials: "include", body });
});
