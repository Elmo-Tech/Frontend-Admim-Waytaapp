// Request expectations captured from the unchanged pre-refactor API wrappers.
import { platformFetch } from "../../src/lib/api/client";
import { login, getMe, logout, changeOwnPassword } from "../../src/lib/auth/client";
import { getPublicSettings, updatePublicSettings, getTrialSettings, updateTrialSettings, getAiSettings, updateAiSettings, addAiKey, updateAiKey, deleteAiKey, testAiKey, adjustActiveTrials } from "../../src/modules/settings/api/settings";
import { listRestaurants, getRestaurant, setExclusiveDesign, updateRestaurantMenuSlug, updateRestaurantOwnerContact, setRestaurantStatus, setRestaurantFeature, createRestaurant, assignRestaurantPackage } from "../../src/modules/restaurants/api/restaurants";
import { listPackages, getPackage, createPackage, updatePackage, deletePackage } from "../../src/modules/packages/api/packages";
import { listDemos, createDemo, extendDemo, newDemoLink, removeDemo } from "../../src/modules/demos/api/demos";
import { listAdmins, createAdmin, setAdminStatus, resetAdminPassword } from "../../src/modules/team/api/team";
import { getAudit } from "../../src/modules/activity/api/activity";
import { getBilling, setBillingCountry, previewSubscription, createSubscription, createTrial, updateTrial, cancelSubscription, recordPayment, voidPayment } from "../../src/modules/billing/api/billing";
import { listLeads, updateLead } from "../../src/modules/leads/api/leads";
import { listRequests, updateRequest } from "../../src/modules/requests/api/requests";

jest.mock("@/lib/api/client", () => ({ platformFetch: jest.fn() }));
beforeEach(() => { jest.clearAllMocks(); jest.mocked(platformFetch).mockResolvedValue({ data: {} }); });

it("login preserves its original URL, method and payload", async () => {
  await login("admin@example.test", "test-password");
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/auth/login",{"method":"POST","body":{"email":"admin@example.test","password":"test-password"}}]]);
});

it("getMe preserves its original URL, method and payload", async () => {
  await getMe();
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/auth/me"]]);
});

it("logout preserves its original URL, method and payload", async () => {
  await logout();
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/auth/logout",{"method":"POST"}]]);
});

it("changeOwnPassword preserves its original URL, method and payload", async () => {
  await changeOwnPassword("current-password", "next-password");
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/auth/password",{"method":"PUT","body":{"currentPassword":"current-password","newPassword":"next-password"}}]]);
});

it("getPublicSettings preserves its original URL, method and payload", async () => {
  await getPublicSettings();
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/settings/public"]]);
});

it("updatePublicSettings preserves its original URL, method and payload", async () => {
  await updatePublicSettings("https://example.test/a?b=1");
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/settings/public",{"method":"PUT","body":{"poweredByUrl":"https://example.test/a?b=1"}}]]);
});

it("getTrialSettings preserves its original URL, method and payload", async () => {
  await getTrialSettings();
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/settings/trial"]]);
});

it("updateTrialSettings preserves its original URL, method and payload", async () => {
  await updateTrialSettings({"enabled":true,"defaultDays":15,"defaultPackageId":null});
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/settings/trial",{"method":"PUT","body":{"enabled":true,"defaultDays":15,"defaultPackageId":null}}]]);
});

it("getAiSettings preserves its original URL, method and payload", async () => {
  await getAiSettings();
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/settings/ai"]]);
});

it("updateAiSettings preserves its original URL, method and payload", async () => {
  await updateAiSettings({"engine":"DIRECT","model":"model-1","fallbackModel":null});
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/settings/ai",{"method":"PUT","body":{"engine":"DIRECT","model":"model-1","fallbackModel":null}}]]);
});

it("addAiKey preserves its original URL, method and payload", async () => {
  await addAiKey({"label":"test key","secret":"dummy-test-key"});
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/settings/ai/keys",{"method":"POST","body":{"label":"test key","secret":"dummy-test-key"}}]]);
});

it("updateAiKey preserves its original URL, method and payload", async () => {
  await updateAiKey("id /?#ع", {"label":"renamed","status":"DISABLED"});
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/settings/ai/keys/id%20%2F%3F%23%D8%B9",{"method":"PATCH","body":{"label":"renamed","status":"DISABLED"}}]]);
});

it("deleteAiKey preserves its original URL, method and payload", async () => {
  await deleteAiKey("id /?#ع");
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/settings/ai/keys/id%20%2F%3F%23%D8%B9",{"method":"DELETE"}]]);
});

it("testAiKey preserves its original URL, method and payload", async () => {
  await testAiKey("id /?#ع");
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/settings/ai/keys/id%20%2F%3F%23%D8%B9/test",{"method":"POST"}]]);
});

it("adjustActiveTrials preserves its original URL, method and payload", async () => {
  await adjustActiveTrials(7);
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/settings/trial/adjust-active",{"method":"POST","body":{"days":7}}]]);
});

it("listRestaurants preserves its original URL, method and payload", async () => {
  await listRestaurants({"search":"  مطعم  ","status":"ACTIVE","subscription":"TRIAL","page":2});
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/restaurants?page=2&pageSize=20&search=%D9%85%D8%B7%D8%B9%D9%85&status=ACTIVE&subscription=TRIAL"]]);
});

it("getRestaurant preserves its original URL, method and payload", async () => {
  await getRestaurant("id /?#ع");
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/restaurants/id%20%2F%3F%23%D8%B9"]]);
});

it("setExclusiveDesign preserves its original URL, method and payload", async () => {
  await setExclusiveDesign("id /?#ع", {"baseTemplate":"CLASSIC","status":"RESERVED"});
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/restaurants/id%20%2F%3F%23%D8%B9/exclusive-design",{"method":"PUT","body":{"baseTemplate":"CLASSIC","status":"RESERVED"}}]]);
});

it("updateRestaurantMenuSlug preserves its original URL, method and payload", async () => {
  await updateRestaurantMenuSlug("id /?#ع", "new-slug");
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/restaurants/id%20%2F%3F%23%D8%B9/menu-slug",{"method":"PUT","body":{"slug":"new-slug"}}]]);
});

it("updateRestaurantOwnerContact preserves its original URL, method and payload", async () => {
  await updateRestaurantOwnerContact("id /?#ع", {"fullName":"مسؤول","phone":"+201000000000","facebookUrl":null});
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/restaurants/id%20%2F%3F%23%D8%B9/owner-contact",{"method":"PUT","body":{"fullName":"مسؤول","phone":"+201000000000","facebookUrl":null}}]]);
});

it("setRestaurantStatus preserves its original URL, method and payload", async () => {
  await setRestaurantStatus("id /?#ع", "SUSPENDED");
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/restaurants/id%20%2F%3F%23%D8%B9/status",{"method":"PATCH","body":{"status":"SUSPENDED"}}]]);
});

it("setRestaurantFeature preserves its original URL, method and payload", async () => {
  await setRestaurantFeature("id /?#ع", "MENU_TEMPLATES", null);
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/restaurants/id%20%2F%3F%23%D8%B9/features/MENU_TEMPLATES",{"method":"PUT","body":{"enabled":null}}]]);
});

it("createRestaurant preserves its original URL, method and payload", async () => {
  await createRestaurant({"restaurantName":"مطعم","ownerEmail":"owner@example.test","ownerPassword":"dummy-password","branchName":"فرع","defaultLocale":"ar","currencyCode":"EGP","timezone":"Africa/Cairo","countryCode":"EG","packageId":null,"acquisition":{"sourceType":"DIRECT"},"ownerContact":{"fullName":"مسؤول","phone":"+201000000000","facebookUrl":null}});
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/restaurants",{"method":"POST","body":{"restaurantName":"مطعم","ownerEmail":"owner@example.test","ownerPassword":"dummy-password","branchName":"فرع","defaultLocale":"ar","currencyCode":"EGP","timezone":"Africa/Cairo","countryCode":"EG","packageId":null,"acquisition":{"sourceType":"DIRECT"},"ownerContact":{"fullName":"مسؤول","phone":"+201000000000","facebookUrl":null}}}]]);
});

it("assignRestaurantPackage preserves its original URL, method and payload", async () => {
  await assignRestaurantPackage("id /?#ع", null);
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/restaurants/id%20%2F%3F%23%D8%B9/package",{"method":"PUT","body":{"packageId":null}}]]);
});

it("listPackages preserves its original URL, method and payload", async () => {
  await listPackages();
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/packages"]]);
});

it("getPackage preserves its original URL, method and payload", async () => {
  await getPackage("id /?#ع");
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/packages/id%20%2F%3F%23%D8%B9"]]);
});

it("createPackage preserves its original URL, method and payload", async () => {
  await createPackage({"nameAr":"باقة","nameEn":"Package","descriptionAr":null,"descriptionEn":null,"prices":{"egpMonthly":"1234.50","egpYearly":null,"usdMonthly":"19.99","usdYearly":null},"offer":null,"templates":{"all":true,"allStandard":false,"selected":[]},"features":["MENU_TEMPLATES"]});
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/packages",{"method":"POST","body":{"nameAr":"باقة","nameEn":"Package","descriptionAr":null,"descriptionEn":null,"prices":{"egpMonthly":"1234.50","egpYearly":null,"usdMonthly":"19.99","usdYearly":null},"offer":null,"templates":{"all":true,"allStandard":false,"selected":[]},"features":["MENU_TEMPLATES"]}}]]);
});

it("updatePackage preserves its original URL, method and payload", async () => {
  await updatePackage("id /?#ع", {"status":"ARCHIVED"});
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/packages/id%20%2F%3F%23%D8%B9",{"method":"PATCH","body":{"status":"ARCHIVED"}}]]);
});

it("deletePackage preserves its original URL, method and payload", async () => {
  await deletePackage("id /?#ع");
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/packages/id%20%2F%3F%23%D8%B9",{"method":"DELETE"}]]);
});

it("listDemos preserves its original URL, method and payload", async () => {
  await listDemos();
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/demos"]]);
});

it("createDemo preserves its original URL, method and payload", async () => {
  await createDemo({"label":"عرض","hours":24,"kind":"cafe","packageId":"package-1"});
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/demos",{"method":"POST","body":{"label":"عرض","hours":24,"kind":"cafe","packageId":"package-1"}}]]);
});

it("extendDemo preserves its original URL, method and payload", async () => {
  await extendDemo("id /?#ع", 72);
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/demos/id%20%2F%3F%23%D8%B9/extend",{"method":"POST","body":{"hours":72}}]]);
});

it("newDemoLink preserves its original URL, method and payload", async () => {
  await newDemoLink("id /?#ع");
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/demos/id%20%2F%3F%23%D8%B9/link",{"method":"POST"}]]);
});

it("removeDemo preserves its original URL, method and payload", async () => {
  await removeDemo("id /?#ع");
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/demos/id%20%2F%3F%23%D8%B9",{"method":"DELETE"}]]);
});

it("listAdmins preserves its original URL, method and payload", async () => {
  await listAdmins();
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/admins"]]);
});

it("createAdmin preserves its original URL, method and payload", async () => {
  await createAdmin({"email":"team@example.test","displayName":"Team","password":"dummy-password"});
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/admins",{"method":"POST","body":{"email":"team@example.test","displayName":"Team","password":"dummy-password"}}]]);
});

it("setAdminStatus preserves its original URL, method and payload", async () => {
  await setAdminStatus("id /?#ع", "DISABLED");
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/admins/id%20%2F%3F%23%D8%B9/status",{"method":"PATCH","body":{"status":"DISABLED"}}]]);
});

it("resetAdminPassword preserves its original URL, method and payload", async () => {
  await resetAdminPassword("id /?#ع", "dummy-password");
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/admins/id%20%2F%3F%23%D8%B9/password",{"method":"PUT","body":{"password":"dummy-password"}}]]);
});

it("getAudit preserves its original URL, method and payload", async () => {
  await getAudit("id /?#ع");
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/audit?limit=100&restaurantId=id%20%2F%3F%23%D8%B9"]]);
});

it("getBilling preserves its original URL, method and payload", async () => {
  await getBilling("id /?#ع");
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/restaurants/id%20%2F%3F%23%D8%B9/billing"]]);
});

it("setBillingCountry preserves its original URL, method and payload", async () => {
  await setBillingCountry("id /?#ع", "EG");
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/restaurants/id%20%2F%3F%23%D8%B9/country",{"method":"PUT","body":{"countryCode":"EG"}}]]);
});

it("previewSubscription preserves its original URL, method and payload", async () => {
  await previewSubscription("id /?#ع", {"packageId":"package-1","period":"YEARLY","startsAt":"2026-11-12","discount":{"type":"AMOUNT","value":"0.10"}});
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/restaurants/id%20%2F%3F%23%D8%B9/subscriptions/preview",{"method":"POST","body":{"packageId":"package-1","period":"YEARLY","startsAt":"2026-11-12","discount":{"type":"AMOUNT","value":"0.10"}}}]]);
});

it("createSubscription preserves its original URL, method and payload", async () => {
  await createSubscription("id /?#ع", {"packageId":"package-1","period":"MONTHLY"});
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/restaurants/id%20%2F%3F%23%D8%B9/subscriptions",{"method":"POST","body":{"packageId":"package-1","period":"MONTHLY"}}]]);
});

it("createTrial preserves its original URL, method and payload", async () => {
  await createTrial("id /?#ع", {"packageId":"package-1","durationDays":15});
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/restaurants/id%20%2F%3F%23%D8%B9/trials",{"method":"POST","body":{"packageId":"package-1","durationDays":15}}]]);
});

it("updateTrial preserves its original URL, method and payload", async () => {
  await updateTrial("id /?#ع", "2026-12-01");
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/subscriptions/id%20%2F%3F%23%D8%B9/trial",{"method":"PUT","body":{"endsAt":"2026-12-01"}}]]);
});

it("cancelSubscription preserves its original URL, method and payload", async () => {
  await cancelSubscription("id /?#ع");
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/subscriptions/id%20%2F%3F%23%D8%B9/cancel",{"method":"POST"}]]);
});

it("recordPayment preserves its original URL, method and payload", async () => {
  await recordPayment("id /?#ع", {"amount":"1234.50","method":"CASH","paidAt":"2026-11-12","reference":"ref","notes":"note"});
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/subscriptions/id%20%2F%3F%23%D8%B9/payments",{"method":"POST","body":{"amount":"1234.50","method":"CASH","paidAt":"2026-11-12","reference":"ref","notes":"note"}}]]);
});

it("voidPayment preserves its original URL, method and payload", async () => {
  await voidPayment("id /?#ع", "payment /?#", "reason");
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/subscriptions/id%20%2F%3F%23%D8%B9/payments/payment%20%2F%3F%23/void",{"method":"POST","body":{"reason":"reason"}}]]);
});

it("listLeads preserves its original URL, method and payload", async () => {
  await listLeads("open");
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/leads?filter=open"]]);
});

it("updateLead preserves its original URL, method and payload", async () => {
  await updateLead("id /?#ع", {"status":"DONE","note":""});
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/leads/id%20%2F%3F%23%D8%B9",{"method":"PATCH","body":{"status":"DONE","note":""}}]]);
});

it("listRequests preserves its original URL, method and payload", async () => {
  await listRequests("all");
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/subscription-requests?filter=all"]]);
});

it("updateRequest preserves its original URL, method and payload", async () => {
  await updateRequest("id /?#ع", {"status":"CONTACTED","note":"follow up"});
  expect(jest.mocked(platformFetch).mock.calls).toEqual([["/subscription-requests/id%20%2F%3F%23%D8%B9",{"method":"PATCH","body":{"status":"CONTACTED","note":"follow up"}}]]);
});

