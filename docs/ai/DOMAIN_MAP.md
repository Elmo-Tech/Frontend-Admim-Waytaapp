# Platform domain ownership map

Phase 1 source inventory, 2026-11-15. Coverage: **12/12** existing module directories. This is a knowledge map, not a proposed architecture, endpoint catalog or runtime verification result.

## Reading the entries

Each entry records responsibility, actual source, public files, representative internals, request ownership, rules, related specification status, client/server boundaries, tests and risk. Public files list actual root TypeScript files; whether a consumer may import them is governed by [architecture](../ARCHITECTURE.md). An empty composition index is not evidence of a missing feature.

API ownership describes source files, not inferred URLs. Shared authentication and inline server/public requests are explicitly identified. Request-preservation checks are structural evidence, not user-flow coverage. Global checks for every domain are the existing architecture scanner and lint/typecheck scripts. Phase 1 ran the existing architecture scanner to verify this map’s enforcement references; application lint/typecheck/tests/build were not run. See [Phase 1 results](PHASE1_VALIDATION.md) and [Validation](VALIDATION.md).

Specification IDs resolve to the classified registry in [SPEC_MAP.md](SPEC_MAP.md). Self-described authoritative baselines, explicitly accepted decisions, implementation history and unapproved proposals are different evidence classes. Preserve current behavior pending resolution of a real conflict.

## activity

Operational audit feed and audit-page composition.

- **Source:** [src/modules/activity](../../src/modules/activity). **Public files:** [src/modules/activity/index.ts](../../src/modules/activity/index.ts), [src/modules/activity/server.ts](../../src/modules/activity/server.ts).
- **Important internals:** [src/modules/activity/components/ActivityPage.tsx](../../src/modules/activity/components/ActivityPage.tsx), [src/modules/activity/components/ActivityFeed.tsx](../../src/modules/activity/components/ActivityFeed.tsx).
- **API ownership:** [src/modules/activity/api/activity.ts](../../src/modules/activity/api/activity.ts)
- **Rules:** Preserve audit attribution/details and server-read failures.
- **Specifications:** [DEC](../../../operations/docs/00-product/PROJECT_DECISIONS.md), [AUTH](../../../operations/docs/02-technical/AUTH_TENANCY_SPEC.md), [API](../../../operations/docs/02-technical/API_CONVENTIONS.md). Decision context: DEC-045.
- **Client/server boundary:** ActivityPage is a server read behind server.ts; ActivityFeed/index are reusable browser-safe presentation.
- **Tests/checks:** Central tests referencing domain source: [tests/api/request-contracts.spec.ts](../../tests/api/request-contracts.spec.ts). Global checks above apply; runtime/browser coverage is not certified here.
- **Constraints/risks:** Use server.ts for ActivityPage; keep the feed/index browser-safe for client consumers.

## auth

Platform login page/form; session-aware login composition.

- **Source:** [src/modules/auth](../../src/modules/auth). **Public files:** [src/modules/auth/index.ts](../../src/modules/auth/index.ts).
- **Important internals:** [src/modules/auth/components/LoginPage.tsx](../../src/modules/auth/components/LoginPage.tsx), [src/modules/auth/components/LoginForm.tsx](../../src/modules/auth/components/LoginForm.tsx).
- **API ownership:** No module `api/` implementation found. No module api/: LoginForm uses src/lib/auth/client.ts, LoginPage uses src/lib/auth/server.ts.
- **Rules:** Only a genuine unauthenticated response takes the existing login redirect path.
- **Specifications:** [AUTH](../../../operations/docs/02-technical/AUTH_TENANCY_SPEC.md), [DEC](../../../operations/docs/00-product/PROJECT_DECISIONS.md). Decision context: DEC-045.
- **Client/server boundary:** LoginPage reads server session; LoginForm calls the browser auth client.
- **Tests/checks:** No colocated or direct domain-source test reference found; shared auth/transport checks are not a substitute for domain behavior coverage. Global checks above apply; runtime/browser coverage is not certified here.
- **Constraints/risks:** Unavailable API is not logged-out identity; platform sessions differ from restaurant sessions.

## billing

Restaurant subscriptions, trials, manual payments and billing presentation.

- **Source:** [src/modules/billing](../../src/modules/billing). **Public files:** [src/modules/billing/index.ts](../../src/modules/billing/index.ts).
- **Important internals:** [src/modules/billing/components/BillingSection.tsx](../../src/modules/billing/components/BillingSection.tsx), [src/modules/billing/components/NewSubscriptionForm.tsx](../../src/modules/billing/components/NewSubscriptionForm.tsx), [src/modules/billing/components/NewTrialForm.tsx](../../src/modules/billing/components/NewTrialForm.tsx), [src/modules/billing/components/SubscriptionCard.tsx](../../src/modules/billing/components/SubscriptionCard.tsx).
- **API ownership:** [src/modules/billing/api/billing.ts](../../src/modules/billing/api/billing.ts), [src/modules/billing/api/errors.ts](../../src/modules/billing/api/errors.ts)
- **Rules:** Preserve exact currency/amount strings and explicit preview/create/payment actions.
- **Specifications:** [DEC](../../../operations/docs/00-product/PROJECT_DECISIONS.md), [API](../../../operations/docs/02-technical/API_CONVENTIONS.md). Decision context: DEC-049, DEC-056.
- **Client/server boundary:** Domain views/forms are client-side; parent App Router/session composition remains server-side. Keep transport and private origin configuration separated.
- **Tests/checks:** Central tests referencing domain source: [tests/api/request-contracts.spec.ts](../../tests/api/request-contracts.spec.ts), [tests/contract/contract-document-view.spec.ts](../../tests/contract/contract-document-view.spec.ts). Global checks above apply; runtime/browser coverage is not certified here.
- **Constraints/risks:** A document edit or frontend total does not modify the authoritative payment ledger.

## contracts

Contract read/composition, editable draft, document compatibility, signing assets and print.

- **Source:** [src/modules/contracts](../../src/modules/contracts). **Public files:** [src/modules/contracts/index.ts](../../src/modules/contracts/index.ts).
- **Important internals:** [src/modules/contracts/components/ContractPage.tsx](../../src/modules/contracts/components/ContractPage.tsx), [src/modules/contracts/components/ContractEditor.tsx](../../src/modules/contracts/components/ContractEditor.tsx), [src/modules/contracts/hooks/use-contract-editor.ts](../../src/modules/contracts/hooks/use-contract-editor.ts), [src/modules/contracts/utils/contract-document-model.ts](../../src/modules/contracts/utils/contract-document-model.ts).
- **API ownership:** [src/modules/contracts/api/contracts.ts](../../src/modules/contracts/api/contracts.ts)
- **Rules:** Keep revision/language/serialized document and draft/issue/reopen/upload boundaries.
- **Specifications:** [CONTRACT](../../../operations/docs/03-ui-ux/CONTRACT_DRAFTS_AND_MENU_SUBDOMAINS.md), [DEC](../../../operations/docs/00-product/PROJECT_DECISIONS.md), [API](../../../operations/docs/02-technical/API_CONVENTIONS.md). Decision context: DEC-049; CONTRACT amends DEC-049/066.
- **Client/server boundary:** ContractPage performs server reads; ContractEditor/print interactions remain client-side.
- **Tests/checks:** Central tests referencing domain source: [tests/api/contract-editing.spec.ts](../../tests/api/contract-editing.spec.ts), [tests/contract/contract-document-view.spec.ts](../../tests/contract/contract-document-view.spec.ts), [tests/contract/signature-bounds.spec.ts](../../tests/contract/signature-bounds.spec.ts). Global checks above apply; runtime/browser coverage is not certified here.
- **Constraints/risks:** Server reads and interactive editor must stay separated; A4/signature bounds need rendered checks for relevant changes.

## dashboard

Server-rendered platform overview, aggregates, attention and recent activity.

- **Source:** [src/modules/dashboard](../../src/modules/dashboard). **Public files:** [src/modules/dashboard/index.ts](../../src/modules/dashboard/index.ts).
- **Important internals:** [src/modules/dashboard/components/OverviewPage.tsx](../../src/modules/dashboard/components/OverviewPage.tsx), [src/modules/dashboard/components/OverviewParts.tsx](../../src/modules/dashboard/components/OverviewParts.tsx).
- **API ownership:** No module `api/` implementation found. No module api/: OverviewPage calls shared platformServerGet directly.
- **Rules:** Keep server-rendered reads and existing aggregate presentation.
- **Specifications:** [DEC](../../../operations/docs/00-product/PROJECT_DECISIONS.md), [AUTH](../../../operations/docs/02-technical/AUTH_TENANCY_SPEC.md), [API](../../../operations/docs/02-technical/API_CONVENTIONS.md). Decision context: DEC-045.
- **Client/server boundary:** OverviewPage performs the server read; do not export it into a browser composition barrel.
- **Tests/checks:** No colocated or direct domain-source test reference found; shared auth/transport checks are not a substitute for domain behavior coverage. Global checks above apply; runtime/browser coverage is not certified here.
- **Constraints/risks:** Do not infer API ownership from the folder: current read is inline in OverviewPage, not a domain API wrapper.

## demos

Platform demo list/create, expiry extension, secret-link replacement and removal.

- **Source:** [src/modules/demos](../../src/modules/demos). **Public files:** [src/modules/demos/index.ts](../../src/modules/demos/index.ts).
- **Important internals:** [src/modules/demos/components/DemosView.tsx](../../src/modules/demos/components/DemosView.tsx).
- **API ownership:** [src/modules/demos/api/demos.ts](../../src/modules/demos/api/demos.ts)
- **Rules:** Preserve demo kinds, expiry and one-time-link display behavior.
- **Specifications:** [DEMO](../../../operations/docs/01-domain/DEMO_RESTAURANTS_SPEC.md), [DEC](../../../operations/docs/00-product/PROJECT_DECISIONS.md). Decision context: DEC-060, DEC-061.
- **Client/server boundary:** Domain views/forms are client-side; parent App Router/session composition remains server-side. Keep transport and private origin configuration separated.
- **Tests/checks:** Central tests referencing domain source: [tests/api/request-contracts.spec.ts](../../tests/api/request-contracts.spec.ts). Global checks above apply; runtime/browser coverage is not certified here.
- **Constraints/risks:** Showing a demo or countdown does not verify backend purge, isolation or current release state.

## leads

Public signup/trial lead inbox with filtering and handling updates.

- **Source:** [src/modules/leads](../../src/modules/leads). **Public files:** [src/modules/leads/index.ts](../../src/modules/leads/index.ts).
- **Important internals:** [src/modules/leads/components/LeadsView.tsx](../../src/modules/leads/components/LeadsView.tsx).
- **API ownership:** [src/modules/leads/api/leads.ts](../../src/modules/leads/api/leads.ts)
- **Rules:** Keep lead status/note handling and current filter semantics.
- **Specifications:** [DEC](../../../operations/docs/00-product/PROJECT_DECISIONS.md), [AUTH](../../../operations/docs/02-technical/AUTH_TENANCY_SPEC.md), [API](../../../operations/docs/02-technical/API_CONVENTIONS.md). Decision context: DEC-053.
- **Client/server boundary:** Domain views/forms are client-side; parent App Router/session composition remains server-side. Keep transport and private origin configuration separated.
- **Tests/checks:** Central tests referencing domain source: [tests/api/request-contracts.spec.ts](../../tests/api/request-contracts.spec.ts). Global checks above apply; runtime/browser coverage is not certified here.
- **Constraints/risks:** Lead contact information is platform-private, not guest/staff public content.

## packages

Package list/editor, feature/template selection, price normalization and CRUD.

- **Source:** [src/modules/packages](../../src/modules/packages). **Public files:** [src/modules/packages/index.ts](../../src/modules/packages/index.ts).
- **Important internals:** [src/modules/packages/components/PackageEditor.tsx](../../src/modules/packages/components/PackageEditor.tsx), [src/modules/packages/hooks/use-package-editor.ts](../../src/modules/packages/hooks/use-package-editor.ts), [src/modules/packages/utils/package-form.ts](../../src/modules/packages/utils/package-form.ts).
- **API ownership:** [src/modules/packages/api/errors.ts](../../src/modules/packages/api/errors.ts), [src/modules/packages/api/packages.ts](../../src/modules/packages/api/packages.ts)
- **Rules:** Preserve synchronous mutation guard, field focus, failure retention and detail-load retry.
- **Specifications:** [DEC](../../../operations/docs/00-product/PROJECT_DECISIONS.md), [API](../../../operations/docs/02-technical/API_CONVENTIONS.md). Decision context: DEC-046, DEC-051, DEC-052.
- **Client/server boundary:** Domain views/forms are client-side; parent App Router/session composition remains server-side. Keep transport and private origin configuration separated.
- **Tests/checks:** Central tests referencing domain source: [tests/api/request-contracts.spec.ts](../../tests/api/request-contracts.spec.ts), [tests/packages/package-form.spec.ts](../../tests/packages/package-form.spec.ts). Global checks above apply; runtime/browser coverage is not certified here.
- **Constraints/risks:** Helper tests do not prove the full save/retry browser flow; mixed currency/locale input must preserve exact payloads.

## requests

Restaurant upgrade/renewal request inbox and handling updates.

- **Source:** [src/modules/requests](../../src/modules/requests). **Public files:** [src/modules/requests/index.ts](../../src/modules/requests/index.ts).
- **Important internals:** [src/modules/requests/components/RequestsView.tsx](../../src/modules/requests/components/RequestsView.tsx).
- **API ownership:** [src/modules/requests/api/requests.ts](../../src/modules/requests/api/requests.ts)
- **Rules:** Keep request status/note updates separate from subscription/billing mutations.
- **Specifications:** [DEC](../../../operations/docs/00-product/PROJECT_DECISIONS.md), [AUTH](../../../operations/docs/02-technical/AUTH_TENANCY_SPEC.md), [API](../../../operations/docs/02-technical/API_CONVENTIONS.md). Decision context: DEC-050.
- **Client/server boundary:** Domain views/forms are client-side; parent App Router/session composition remains server-side. Keep transport and private origin configuration separated.
- **Tests/checks:** Central tests referencing domain source: [tests/api/request-contracts.spec.ts](../../tests/api/request-contracts.spec.ts). Global checks above apply; runtime/browser coverage is not certified here.
- **Constraints/risks:** An acknowledged upgrade request is not a completed paid subscription.

## restaurants

Restaurant list/create/detail, contacts, acquisition, features/design and menu-link controls.

- **Source:** [src/modules/restaurants](../../src/modules/restaurants). **Public files:** [src/modules/restaurants/index.ts](../../src/modules/restaurants/index.ts).
- **Important internals:** [src/modules/restaurants/components/RestaurantsView.tsx](../../src/modules/restaurants/components/RestaurantsView.tsx), [src/modules/restaurants/components/create/NewRestaurantForm.tsx](../../src/modules/restaurants/components/create/NewRestaurantForm.tsx), [src/modules/restaurants/components/detail/RestaurantDetailView.tsx](../../src/modules/restaurants/components/detail/RestaurantDetailView.tsx).
- **API ownership:** [src/modules/restaurants/api/restaurants.ts](../../src/modules/restaurants/api/restaurants.ts)
- **Rules:** Preserve private owner/acquisition data and backend restaurant provisioning authority.
- **Specifications:** [DEC](../../../operations/docs/00-product/PROJECT_DECISIONS.md), [AUTH](../../../operations/docs/02-technical/AUTH_TENANCY_SPEC.md), [CONTACT](../../../operations/docs/03-ui-ux/RESTAURANT_OWNER_CONTACTS_IMPLEMENTATION.md), [ACQUIRE](../../../operations/docs/03-ui-ux/RESTAURANT_ACQUISITION_SOURCE_IMPLEMENTATION.md), [CONTRACT](../../../operations/docs/03-ui-ux/CONTRACT_DRAFTS_AND_MENU_SUBDOMAINS.md). Decision context: DEC-047, DEC-066.
- **Client/server boundary:** Domain views/forms are client-side; parent App Router/session composition remains server-side. Keep transport and private origin configuration separated.
- **Tests/checks:** Central tests referencing domain source: [tests/api/request-contracts.spec.ts](../../tests/api/request-contracts.spec.ts). Global checks above apply; runtime/browser coverage is not certified here.
- **Constraints/risks:** CONTACT/ACQUIRE documents still record draft QA state; source presence cannot establish approval, migration or production release.

## settings

Platform public/trial settings and backend extraction engine/key administration UI.

- **Source:** [src/modules/settings](../../src/modules/settings). **Public files:** [src/modules/settings/index.ts](../../src/modules/settings/index.ts).
- **Important internals:** [src/modules/settings/components/SettingsView.tsx](../../src/modules/settings/components/SettingsView.tsx), [src/modules/settings/components/AiSettingsSection.tsx](../../src/modules/settings/components/AiSettingsSection.tsx).
- **API ownership:** [src/modules/settings/api/ai-errors.ts](../../src/modules/settings/api/ai-errors.ts), [src/modules/settings/api/settings.ts](../../src/modules/settings/api/settings.ts)
- **Rules:** Preserve backend-managed key operations, configured-state/error handling and trial controls.
- **Specifications:** [DEC](../../../operations/docs/00-product/PROJECT_DECISIONS.md), [API](../../../operations/docs/02-technical/API_CONVENTIONS.md), [SEC](../../../operations/docs/02-technical/SECURITY_SPEC.md). Decision context: DEC-055, DEC-056, DEC-059.
- **Client/server boundary:** Domain views/forms are client-side; parent App Router/session composition remains server-side. Keep transport and private origin configuration separated.
- **Tests/checks:** Central tests referencing domain source: [tests/api/request-contracts.spec.ts](../../tests/api/request-contracts.spec.ts). Global checks above apply; runtime/browser coverage is not certified here.
- **Constraints/risks:** Console AI-key management is existing product behavior; Phase 1 adds no AI service or orchestration runtime.

## team

Platform administrator list/create/status/password-reset administration.

- **Source:** [src/modules/team](../../src/modules/team). **Public files:** [src/modules/team/index.ts](../../src/modules/team/index.ts).
- **Important internals:** [src/modules/team/components/TeamView.tsx](../../src/modules/team/components/TeamView.tsx).
- **API ownership:** [src/modules/team/api/team.ts](../../src/modules/team/api/team.ts)
- **Rules:** Preserve current-admin safeguards and explicit admin-state/password-reset behavior.
- **Specifications:** [DEC](../../../operations/docs/00-product/PROJECT_DECISIONS.md), [AUTH](../../../operations/docs/02-technical/AUTH_TENANCY_SPEC.md), [API](../../../operations/docs/02-technical/API_CONVENTIONS.md). Decision context: DEC-048.
- **Client/server boundary:** Domain views/forms are client-side; parent App Router/session composition remains server-side. Keep transport and private origin configuration separated.
- **Tests/checks:** Central tests referencing domain source: [tests/api/request-contracts.spec.ts](../../tests/api/request-contracts.spec.ts). Global checks above apply; runtime/browser coverage is not certified here.
- **Constraints/risks:** Do not copy platform-admin permissions into restaurant staff identities or log returned credentials.
