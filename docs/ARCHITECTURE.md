# Platform frontend architecture

The original refactor description below is dated 2026-11-12. Current ownership and enforcement qualifications are recorded in the Phase 1 section at the end. Historical change statements describe that refactor, not this documentation pass.

This document describes the standalone `wayta-platform` frontend after the 2026-11-12 refactor.
The original monorepo and the api/web applications are unchanged. The operations repository has one supporting
test-path update for the relocated template registry; its assertions are unchanged.

```text
src/
  app/                  Next route conventions, layouts, metadata and loading states
  modules/              Business domains and their public entries
  components/
    ui/                 Existing visual primitives and icons
    common/             Reusable country selection and operational status badge
    layout/             Console shell, preferences and authenticated composition
    brand/              Existing Wayta brand components
  lib/
    api/                Browser/server transport, error envelopes and response unwrapping
    auth/               Platform session identity and auth API calls
    i18n/               Existing locale providers, dictionaries and formatting
    permissions/        Shared platform capability vocabulary
    utils/              Technical helpers such as class merging
    theme.tsx           Existing theme provider
  config/               Public/server API settings, countries and inbox presentation configuration
  types/                Cross-domain contract vocabulary
  styles/               Existing global stylesheet, unchanged
  fonts/                Existing self-hosted font files, unchanged
```

There are no empty scaffolding directories, new client-state framework, query library or UI library.

## Dependency rules

Routes compose modules. Modules use shared components, infrastructure and configuration.
Shared components, lib, config, hooks, types and styles must never import modules.
Nothing outside app imports app. Module internals do not import their own barrel.

Each module has a deliberately small `index.ts` exposing only the components/contracts needed by other application code.
Within a module, direct internal imports are allowed. Cross-module consumers use the public entry.
Activity also has an explicit `server.ts` public entry: its server-rendered page cannot be re-exported from the
client-safe index used by RestaurantDetailView. Dashboard, auth and contracts have server-only default page entries,
which are consumed only by routes. Avoid adding them to client-safe barrels.
Unit tests may import pure internal helpers to exercise real validation and serialization behavior.

`npm run lint` enforces layer direction and public entries. `npm run check:architecture` also checks the
source graph of static imports and dynamic imports with literal specifiers for runtime cycles, client-to-server imports, unresolved internal imports,
non-routing app source and thick route pages. The same graph check runs in `npm test`.

## Domain ownership

| Domain | Owns |
| --- | --- |
| dashboard | Server-rendered operational overview and its presentation primitives |
| restaurants | Restaurant list/create/detail, owner contacts, acquisition, feature and design controls |
| packages | Package CRUD, template vocabulary, typed form model, validation, editor hook and feature panels |
| requests | Existing restaurant upgrade/renewal inbox |
| leads | Existing public signup/trial inbox |
| demos | Demo management, countdown and one-time link presentation |
| team | Platform administrator management |
| activity | Audit response contract, activity feed and server-rendered activity page |
| settings | Public/trial/AI console configuration and their API error maps |
| billing | Restaurant subscriptions, trials, payments, pricing display and subscription badges |
| contracts | Contract page, draft editing state, save/issue/reopen/upload calls, document compatibility and printing |
| auth | Server-composed login page and the existing interactive login form |

The former 545-line lib/api/platform.ts is split by owner, not replaced with a second transport abstraction.
All domains continue using the same credentialed browser transport. REST paths, encoding, methods, JSON envelopes,
optional/null fields, money strings and backend pricing/authorization authority remain unchanged.
The server read transport keeps cookie/IP forwarding, GET-only access and `cache: no-store`.
SessionBoundary shares the exact console/print authentication rule: only 401 redirects to /login;
other failures show the existing unreachable state. No sessions or permissions are persisted in browser state.

## Client/server boundaries

App pages remain Server Components. Dashboard, login composition, activity reads and contract reads stay on the server.
Interactive forms and existing client-side fetch strategies remain client-side. Domain hooks group their existing state,
effects and mutations; the refactor does not introduce server actions or migrate browser mutations to the server.
Package constants and pure form validation are separated from HTTP code, so importing a template or validating a form
has no environment/network side effect. Private API origin configuration is imported only by server transport.

## Validation and future changes

Read REFACTOR_VALIDATION.md and validation/browser-report.json for exact evidence and limitations.
The regression suite includes request expectations captured from the unchanged API wrappers, authentication/transport
invariants, package serialization/validation, contract compatibility, signature bounds and architecture rules.
Preserve the existing JSX, classes, semantics, Arabic copy and print behavior during future module changes.
Original business specifications remain in ../operations/docs. This frontend architecture is explicitly authorized by
the current refactor task and supersedes legacy frontend file-location references in those historical documents.


## Phase 1 architecture knowledge map — 2026-11-15

The [domain ownership map](ai/DOMAIN_MAP.md) records all 12 existing domains, their public files, representative internals, API owners, boundaries and test references. Use [the classified specification map](ai/SPEC_MAP.md) for product authority. Source presence and historical implementation reports do not establish approval or deployment.

### Layer and request flow

`src/app` composes routes/layouts and domain implementations; domain views/hooks/helpers own business UI. Modules consume shared `src/components`, `src/lib`, configuration and types. Shared code must not import modules; code outside app must not import app. Browser mutations use existing credentialed transport; server reads use existing server transport and session boundaries. Backend permissions, tenancy, pricing and state transitions remain authoritative.

Platform permits cross-module imports through the module index or the explicit server entry. Internals must not import their own index/server composition entry. Activity separates its client-safe index from server composition; dashboard, auth and contracts retain server-composed reads outside client-safe exports.

### Existing enforcement and its limits

The executable source of boundary policy is [architecture-rules.mjs](../scripts/architecture-rules.mjs); [check-architecture.mjs](../scripts/check-architecture.mjs) walks source imports. Existing `npm run check:architecture`, `npm run lint` and architecture tests are the enforcement mechanisms. No parallel checker is introduced here.

The scanner checks literal import edges, internal resolution, runtime cycles, client-to-server reachability, non-routing app source and route page size (at most 20 newline-split lines, including blanks). Platform excludes explicitly type-only edges; unlike Web, it does not rebuild the graph from emitted JavaScript. This is static evidence: computed import targets, runtime payload semantics, provider behavior and real authorization are outside its proof. Keep server-only implementations/private origins unreachable from client entry graphs; a browser-safe root contract does not make every file in a module client-safe.

### Ownership exceptions and repository independence

Request ownership is evidenced by source, not a rule that every module must have an api directory. See domain entries for direct shared-auth calls, inline requests and server-read composition. Reuse existing transports; do not add wrappers merely to make the documentation uniform.

This frontend owns its package manifest, lockfile, environment and runtime configuration. The parent is not an npm workspace. Operations specifications are read-only sibling knowledge references; there are no cross-repository source imports or shared runtime library. Historical `apps/*` paths in operations describe the former monorepo and do not override the standalone repository decision.

[Governance inventory and gaps](ai/GOVERNANCE_AUDIT.md) and [Phase 1 validation](ai/PHASE1_VALIDATION.md) distinguish observed facts from unresolved evidence. Refactor/stability reports remain dated records; current CI, browser behavior and production were not certified in Phase 1.
