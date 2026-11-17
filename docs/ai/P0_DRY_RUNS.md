# P0 documentation-only evaluations — Platform

Evaluated 2026-11-15 against current source at `a13aab637e99db1ccafae4d618afc4486c975fca`. These are completed planning walkthroughs, not application implementations. No application source or tests were changed; no runtime verification of the proposed examples was executed. They test procedure completeness; they do not prove runtime correctness or compliance across AI tools.

## Evaluation A: Safe Refactor

Procedure: [SAFE_REFACTOR.md](SAFE_REFACTOR.md). Candidate: separate the private Kpi prop type from presentation in its existing file.

### Discover

Owner: [dashboard](DOMAIN_MAP.md#dashboard). Inspected [OverviewParts.tsx](../../src/modules/dashboard/components/OverviewParts.tsx), its actual caller [OverviewPage.tsx](../../src/modules/dashboard/components/OverviewPage.tsx) and [the module index](../../src/modules/dashboard/index.ts). Kpi renders a Card with label, optional hint, children, tone-based text and an optional Link. OverviewPage supplies four Kpi instances. Server fetching and money formatting are outside Kpi's responsibilities; MoneyLines is a separate function in the same file and must remain untouched.

Read [domain rules](DOMAIN_RULES.md), [architecture public-entry rules](../ARCHITECTURE.md#dependency-rules) and [specification status](SPEC_MAP.md). Relevant [i18n](../../../operations/docs/01-domain/I18N_SPEC.md) and [accessibility](../../../operations/docs/03-ui-ux/MOTION_ACCESSIBILITY_SPEC.md) documents are baselines, not approval for a new feature. Existing [architecture tests](../../tests/architecture.spec.ts) protect source boundaries. Source searches found no direct Kpi/OverviewParts behavioral test in the current tests tree.

### Analyze

Preserve the Kpi export and prop shapes: required label/children; optional hint/href/tone; tone union neutral/success/warning/primary and neutral default. Keep Card classes, accent mapping, content order, hint truthiness, Link wrapper only for truthy href and exact href. No new client directive, request, formatter, prop coercion or markup.

| Before/after observation to preserve | Future behavior-oriented verification |
| --- | --- |
| href supplied versus absent/empty | Same Link versus plain Card branch and destination; no new focus target |
| Each tone and omitted tone | Same text accent/default; literal CSS tokens retained |
| Hint absent/empty versus present | Same omission/text placement |
| Existing translated label/children | Same strings/nodes, direction and responsive layout; money children remain opaque to Kpi |

No form/request/effect exists in Kpi: invalid input, loading/failure/retry, stale reads and duplicate mutations are not new component scenarios. Preserve OverviewPage's server read and error branch without touching them.

### Plan

Risk: **LOW**, a private presentation-only type extraction in one file, not a module refactor or change to displayed amounts/public contracts. Smallest candidate: introduce a non-exported KpiProps type in OverviewParts and apply it to the existing parameter. Benefit: separate the type contract from rendering for a future presentation edit. Avoid exporting a type, moving code or inventing a generic card layer. If the real task has no readability need, leave this small implementation unchanged.

Potential regressions: altered optional fields/default, widened/narrowed tone union, accidental runtime imports or changed JSX. Revert only this task's local type edit if needed; no reset of user changes. Raise to MEDIUM for a module/import refactor and HIGH for money, auth, transport or public-contract changes.

### Refactor — simulated only

No application diff was applied. Proposed type-only change stays within dashboard internals. The route uses the server-composed default index; this plan does not expose OverviewPage through a client-safe entry. Platform consumers use module index/server contracts, not Web's broader root-capability rule.

### Verify — plan, not runtime result

A future implementation must run the existing application baseline in [VALIDATION.md](VALIDATION.md) and compare the branches above in rendered/manual output. Existing architecture/unit checks do not demonstrate Kpi visual equivalence. Inspect all four current callers and keyboard navigation on linked cards in Arabic/English. Do not add a test merely reproducing the private type declaration. The existing [browser harness](../../scripts/browser-qa.mjs) includes overview route coverage, but that does not establish these type/branch comparisons without inspecting actual assertions and results.

### Report

**Planning evaluation: Passed.** Owner, caller, preservation contract, minimal plan, risk and required checks are present. **Implementation: Not run. Runtime equivalence: Not verifiable.** Remaining risk is accidental scope expansion into server reads or money presentation; those are explicitly excluded.

## Evaluation B: Feature Implementation

Procedure: [FEATURE_IMPLEMENTATION.md](FEATURE_IMPLEMENTATION.md). Discovery found that OverviewPage renders EmptyState with only a title when recentRestaurants is empty; the shared component already supports children. Hypothetical objective: explain where recently created restaurants will appear, without changing data, roles or actions.

The following is a concise instance of [CHANGE_SPEC_TEMPLATE.md](CHANGE_SPEC_TEMPLATE.md), retaining its headings. It is not a second template.

### Status and scope

- **Status:** hypothetical draft for evaluation only; not an approved feature or instruction to implement.
- **User request/ticket:** no product request; Phase 2 permits a labeled hypothetical evaluation.
- **Repository/owner:** platform / dashboard.
- **Existing routes/public entries:** existing overview composition through dashboard's default index; no route/export changes.
- **In scope if later authorized:** one localized descriptive line in the recent-restaurants empty state.
- **Out of scope:** provisioning, ordering/filtering/limits, request handling, permissions, tenant scope, payments, other empty states and shared component changes.

### Evidence and decisions

- [OverviewPage.tsx](../../src/modules/dashboard/components/OverviewPage.tsx) checks recentRestaurants.length and supplies the title. [EmptyState](../../src/components/ui/index.tsx) already renders optional children in a paragraph. [messages.ts](../../src/lib/i18n/messages.ts) owns typed English/Arabic UI copy.
- [SPEC_MAP.md](SPEC_MAP.md) and accepted platform decision topics establish context, not approval for this new text. Copy/behavior needs authorization before implementation; no accepted decision was invented.
- Existing architecture tests and overview browser route checks are references, not acceptance coverage for this unimplemented criterion. No direct dashboard empty-state behavioral test was established by the source search.

### Behavior

- Trigger/current result: successful existing overview read and empty recentRestaurants array renders the existing title only.
- Requested result: retain title and show a descriptive child paragraph. Proposed EN: “Recently created restaurants will appear here.” Proposed AR: “ستظهر المطاعم المُضافة حديثًا هنا.” This describes the recent list, not the total restaurant count; copy remains hypothetical.
- Actors/context: existing authenticated platform administrator/session; do not introduce a permission, infer tenant access or add a restaurant-create action. Existing unauthenticated/unavailable handling remains unchanged.
- Inputs/validation/API: no new input or endpoint; preserve existing overview GET, response shape, cache/session handling and error branch. Backend remains authoritative for provisioning and data visibility.
- States: render description only in the successful empty branch; nonempty list, route loading, API failure and subsequent retry retain their existing behavior. Repeated navigation/read has no new mutation or persistent state.
- Localization/accessibility: use the existing translation function and matching English/Arabic key, shared EmptyState children and inherited direction/theme. Avoid nested paragraphs, new role/live region, focus changes or overflow at narrow width. No additional dependencies.
- Preserve money formatting, actions, URLs, public exports and every unrelated UI string/asset.

### Acceptance examples

| Given | When | Then | Future verification |
| --- | --- | --- | --- |
| Successful overview with no recent restaurants | EmptyState renders in English/Arabic | Existing title plus localized paragraph | Focused render assertion; Arabic/narrow layout and reading-order check |
| Successful overview with recent restaurants | List renders | New description absent; links/data unchanged | Branch render comparison |
| Existing loading/API failure or retry | Current server/route path executes | No false empty message; existing error/recovery retained | Affected route/fixture or manual comparison; no live backend claim |
| User navigates repeatedly | Overview renders again | No additional action or mutation introduced | Request observation and keyboard navigation check |

Invalid-input submission and rapid duplicate mutation are not applicable: no input or mutation is added. Repeated navigation and failed-read recovery remain relevant preservation cases.

### Implementation and verification

Discover → Specify is documented above. **Plan:** add one typed English/Arabic key in the existing messages file; pass translated text as existing EmptyState children at the single OverviewPage call site. No shared component, App Router, API, index or server/client-boundary changes. Keep all composition server-side; never export a server read through a client-safe barrel.

Risk: **LOW**, isolated display copy. **Implement:** not performed. **Verify:** future application baseline plus criterion-specific branch/rendered/manual checks. Existing harness route visits do not prove the new description/empty/error conditions. **Report:** planning evaluation Passed; implementation Not run; acceptance/runtime behavior Not verifiable until authorization and execution. No product approval or deployment is claimed.
