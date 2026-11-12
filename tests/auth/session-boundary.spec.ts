import { createElement } from "react";
import { SessionBoundary } from "../../src/components/layout/SessionBoundary";
import { getPlatformSession } from "../../src/lib/auth/server";
import { redirect } from "next/navigation";

jest.mock("@/lib/auth/server", () => ({ getPlatformSession: jest.fn() }));
jest.mock("@/lib/i18n/server", () => ({ getI18n: async () => ({ t: (key: string) => key }) }));
jest.mock("next/navigation", () => ({ redirect: jest.fn(() => { throw new Error("redirect"); }) }));

beforeEach(() => jest.clearAllMocks());

it("redirects only a real unauthenticated response to the existing login route", async () => {
  jest.mocked(getPlatformSession).mockResolvedValue({ ok: false, status: 401 });
  await expect(SessionBoundary({ children: () => null })).rejects.toThrow("redirect");
  expect(redirect).toHaveBeenCalledWith("/login");
});

it.each([null, 403, 500])("retains the unreachable state for status %s", async status => {
  jest.mocked(getPlatformSession).mockResolvedValue({ ok: false, status });
  const children = jest.fn(() => null);
  const result = await SessionBoundary({ children });
  expect(result).toMatchObject({ type: "main" });
  expect(redirect).not.toHaveBeenCalled();
  expect(children).not.toHaveBeenCalled();
});

it("passes the verified administrator to the server layout composition", async () => {
  const admin = { id: "admin", email: "admin@example.test", displayName: "Admin" };
  jest.mocked(getPlatformSession).mockResolvedValue({ ok: true, data: admin });
  const content = createElement("p", null, "Protected content");
  const children = jest.fn(() => content);
  expect(await SessionBoundary({ children })).toBe(content);
  expect(children).toHaveBeenCalledWith(admin);
});
