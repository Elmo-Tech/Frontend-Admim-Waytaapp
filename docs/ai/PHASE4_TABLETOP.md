# Phase 4 controlled tabletop — platform

Date: 2026-11-17. Branch: improvement. Inspected source HEAD: `a9d9f32565abcff1f8ec7ab4f5d3de7e11455e73`.

These seven scenarios evaluate the documentation protocol. Source inspection and protocol review are actual manual observations; triggers, future changes and outcomes are **hypothetical** unless explicitly described as historical. No scenario is an application experiment, command execution, fix, upgrade or measured gain. For every scenario below, proposed application checks are **Not run**, runtime conclusions **Not verifiable**. See [actual phase checks](PHASE4_VALIDATION.md) separately.

## 1. Small same-file type extraction

- **DISCOVER:** [OverviewParts.tsx](../../src/modules/dashboard/components/OverviewParts.tsx) still has Kpi's inline props; [OverviewPage](../../src/modules/dashboard/components/OverviewPage.tsx) calls it. MoneyLines is separate and excluded.
- **CLASSIFY/PLAN:** Safe Refactor lead with Test Strategy support; LOW for a hypothetical private same-file KpiProps extraction preserving label/children, optional hint/href/tone, neutral default, Link branch and markup. No public type export or server read change.
- **EXECUTE/VERIFY/REVIEW:** Hypothetically edit only that annotation after authorization; run all application baseline commands from VALIDATION plus relevant before/after rendering and caller observations. Scope/Architecture/Contract gates inspect no runtime/public delta; Test/Build gates still apply. Review the exact final diff; no test that mirrors the type alias is needed.
- **REPORT/recovery:** Current tabletop has no implementation. If such a patch were finished but a required build/browser observation remained missing, Implementation Complete could be Yes, Verification Complete: No, Delivery Ready: No. Revert only the task type edit if necessary. Historical Web build interruption/browser unavailability remains unresolved.

## 2. Medium-risk bug affecting shared behavior

- **DISCOVER:** [use-package-editor.ts](../../src/modules/packages/hooks/use-package-editor.ts) shares a mutation guard across create/update/status/delete. [async-control.ts](../../src/lib/utils/async-control.ts), [async tests](../../tests/async-control.spec.ts) and [package-form tests](../../tests/packages/package-form.spec.ts) provide real supporting source. Hypothetical report: retry state incorrectly remains busy across actions; no current defect is asserted.
- **CLASSIFY/PLAN:** Bug Investigation lead; MEDIUM for editor-local shared state/cleanup preserving public payloads, price/permission behavior and shared helper semantics. HIGH if those change. Reproduce failure followed by retry, establish the responsible owner and plan the smallest editor fix; do not assume the shared utility is defective.
- **EXECUTE/VERIFY/REVIEW:** No patch now. Future fix requires old-failure/corrected-result evidence, existing baseline plus focused tests and affected rendered flows. Contract Gate protects unchanged payloads; Test Gate checks actual failure retention/retry and relevant repeated actions; source/helper passes do not prove a full form. Review callers and final patch for expanded impact.
- **REPORT/recovery:** No reproduced cause means no verified-fix claim and no speculative source edit. Preserve first failure/fixture timing; missing rendered evidence blocks verification/delivery. If later fully implemented, only Implementation Complete may become Yes until all required checks pass. Roll back task-owned form/editor changes only.

## 3. Stalled production build

- **DISCOVER:** [package.json](../../package.json) maps build to the default next build; [VALIDATION](VALIDATION.md) requires it for application changes. [Phase 3 evidence](PHASE3_VALIDATION.md) records the prior Web experiment's interrupted build; it is historical, not a freshly reproduced failure in this repository.
- **CLASSIFY/PLAN:** Retain the underlying change's workflow/risk. A stall is a verification failure, not permission to reclassify a source change as docs. Record a justified time budget, command/environment/patch and expected terminal result.
- **EXECUTE/VERIFY/REVIEW:** Hypothetical run exceeds budget: preserve elapsed time, last output/process/resource signals and terminate only the task-owned process. Build attempt Failed; build success Not verifiable. Build/Evidence gates prevent completion; an alternate bundler is a separate diagnostic, never a substitute default pass.
- **REPORT/recovery:** No blind repeat or CI/build-config workaround. Investigate one hypothesis and retry only with a recorded reason and bounded setup. A finished patch could be Implementation Complete: Yes, Verification Complete: No, Delivery Ready: No. Roll back only task changes if needed, retaining logs.

## 4. Browser automation unavailable

- **DISCOVER:** [browser-qa.mjs](../../scripts/browser-qa.mjs) imports PLAYWRIGHT_MODULE or playwright, uses a local fixture, and blocks unrelated external requests. Playwright is not declared in this repository's manifest. This source inspection does not establish whether an external browser environment is usable today.
- **CLASSIFY/PLAN:** Keep the original workflow/risk; identify exact interaction/RTL/focus/layout criteria and harness gaps. A hypothetical missing browser is not authorization to install tools.
- **EXECUTE/VERIFY/REVIEW:** If unavailable before launch, suite Not run; if launch was attempted and fails, attempt Failed. Static rendering/source observations may be Passed only for their limited criteria, while unobserved interaction remains Not verifiable. Use an already authorized available manual browser only when it actually covers the criterion.
- **REPORT/recovery:** Preserve availability/launch evidence and list unexercised cases. Required missing behavior prevents full verification and delivery even if implementation is finished. Self-review cannot replace browser evidence; no automatic tool installation or production credential use.

## 5. API contract uncertainty

- **DISCOVER:** [contracts.ts](../../src/modules/contracts/api/contracts.ts) writeContract sends revision/locale/text, using PUT draft or POST issue. [Editor hook](../../src/modules/contracts/hooks/use-contract-editor.ts) and [contract tests](../../tests/api/contract-editing.spec.ts) are consumers/evidence. Hypothetical proposal: rename revision; no approval or new field name is supplied.
- **CLASSIFY/PLAN:** API Contract Changes lead, HIGH for the proposed public delta. Record authoritative old/new shapes, consumers, supported/rejected client-server combinations and compatible rollout/rollback; Bug Investigation supports unproven drift.
- **EXECUTE/VERIFY/REVIEW:** Contract/Evidence gates stop dependent adaptation until authority exists. Do not coerce invented fields or change fixtures to imply agreement. Future work needs baseline, real request/error/denial/retry/locale cases and authorized integration separately. Review frontend versus backend claims.
- **REPORT/recovery:** Contract agreement/compatibility Not verifiable, integration Not run. Dependent implementation is incomplete; Implementation Complete: No, Verification Complete: No, Delivery Ready: No for the proposed migration. Continue independent comparison. Client-only rollback may break a changed server; retain compatible-pair notes.

## 6. Dependency upgrade with possible breaking changes

- **DISCOVER:** [manifest](../../package.json)/[lockfile](../../package-lock.json) record Next 16.4.2, matching eslint-config-next and React/React DOM 19.2.8. No upgrade availability/advisory is asserted.
- **CLASSIFY/PLAN:** Dependency Management lead; HIGH for framework effects on SSR/auth/public contracts. Inspect exact target, upstream migration/peer/engine requirements and affected domains before choosing a minimal coupled group; different Jest/ts-jest majors alone do not prove incompatibility.
- **EXECUTE/VERIFY/REVIEW:** No installation now. Future authorized upgrade needs isolated clean install with supported tooling, reviewed manifest/lock/migration delta, baseline default build and affected rendered behavior. Contract/Test/Build/Evidence gates prevent declaring compatibility from install success alone.
- **REPORT/recovery:** Unknown target/peers means compatibility Not verifiable and upgrade implementation deferred. No force/audit-fix/config workaround. Implementation Complete: No, Verification Complete: No, Delivery Ready: No for the proposed upgrade until implemented and evidenced. Roll back matching manifest/lock and task migrations together, preserving security trade-offs.

## 7. Performance change without comparable baseline

- **DISCOVER:** [OverviewPage](../../src/modules/dashboard/components/OverviewPage.tsx) calls platformServerGet('/overview'); [server-fetch](../../src/lib/api/server-fetch.ts) forwards session context with no-store. Source size does not measure overview latency.
- **CLASSIFY/PLAN:** Performance Optimization lead, MEDIUM for owner-local rendering, HIGH if session/private caching/transport changes. Separate API time, server formatting/rendering and browser work under matching dataset/device/locale/cache and production mode.
- **EXECUTE/VERIFY/REVIEW:** Without comparable baseline, stop dependent optimization claims and finish an attribution/measurement plan. If code was already changed in a hypothetical authorized task, inspect preservation and run required correctness checks, but Evidence Gate cannot establish a gain. No invented percent or smaller-file proxy.
- **REPORT/recovery:** Profiling Not run in this tabletop; improvement Not verifiable. A completed patch could have Implementation Complete: Yes, Verification Complete: No, Delivery Ready: No for the performance objective. Keep raw evidence, obtain comparable samples or revert the task-only optimization if unjustified; do not remove correctness/privacy controls for speed.

## Documentation review outcome

Actual manual tabletop review: **Passed** for protocol coverage of all seven cases, source relevance, workflow/risk selection, gate/stop behavior, evidence classification and explicit completion limits. Each scenario exercises DISCOVER through REPORT at the planning level. No simulated check is recorded as an actual pass. The current Phase 4 documentation delivery decisions are in PHASE4_VALIDATION; they do not certify these hypothetical application outcomes.
