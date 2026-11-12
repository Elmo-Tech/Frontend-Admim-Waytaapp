# Platform frontend architecture

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
complete static/dynamic literal import graph for runtime cycles, client-to-server imports, unresolved internal imports,
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
