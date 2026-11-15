# Platform domain rules and source map

These are frontend preservation rules derived from existing source and approved specification topics. They do not replace the full approved specs in [Spec map](SPEC_MAP.md). Read the actual implementation and relevant specs for a behavior change.

## Ownership

Use [DOMAIN_MAP.md](DOMAIN_MAP.md) for the complete source, public entries, API owners, tests and constraints of every existing domain. The map records implementation; this document owns behavior-preservation rules. Read [SPEC_MAP.md](SPEC_MAP.md) for approval status before treating a rule as a product requirement.

## Session and transport invariants

- `SessionBoundary` redirects to `/login` only for an actual 401. Network failure, null status, 403 and server errors retain the existing unreachable state.
- Do not replace unavailable-session handling with an authentication bypass or redirect every failure to login.
- Reuse shared browser transport and domain endpoint functions. Preserve credentials, API paths, query encoding, methods, envelopes and optional/null fields.
- Shared server reads preserve cookie/IP forwarding, GET-only behavior and `cache: no-store`. Browser mutations retain their existing Origin/CSRF semantics.
- Keep private API origin configuration out of client imports. Do not store authoritative sessions or permissions in browser storage.
- Preserve server composition for dashboard, login, activity and contract reads. `activity/server.ts` is an explicit server-only public entry; client-safe barrels must not re-export server implementations.

## Packages and mutations

Read `use-package-editor.ts`, `utils/package-form.ts`, the package APIs and `PackageEditor.tsx` together.

- Preserve the synchronous exclusive guard shared by create/update/status/delete actions. React busy state alone does not block two actions in the same render interval.
- Preserve validation, first-invalid-field focus, input retention and retry after failure. Do not replace valid form entries with defaults after a failed mutation.
- Keep exact money strings and current formatting/normalization. The backend remains authoritative for package prices, subscriptions and payments.
- A load retry must re-fetch the intended package and preserve cancellation of obsolete reads.
- Preserve existing checks and confirmation for deleting packages and restrictions for packages already in use.

## Contracts and billing

- Preserve contract document compatibility, language, serialization and revision semantics. Read request-contract and contract-document tests before changing them.
- Preserve draft versus issued document behavior and existing save/issue/reopen/upload boundaries. Do not automatically issue or reopen a contract as incidental UI cleanup.
- Preserve document assets and signature bounds. Review A4/print presentation when changing contract markup or styles.
- Keep billing amounts, date handling, currency, trials and payment state consistent with existing contracts; do not move authoritative decisions into the browser.

## Presentation and error capture

- Preserve supplied copy, translation keys, original assets, theme, RTL and shared UI conventions.
- Keep `ErrorRecovery` independent of app providers so root-level failure can still render a retry UI.
- Client diagnostics emit metadata only. Do not add raw request bodies, form values, credentials or session data to error logs/events.
- The `wayta:client-error` event is a capture integration point, not proof that an external monitoring collector exists.

## Tests

Existing request, transport, server-fetch, session, package-form and contract tests protect public behavior. Keep their intent. Test changed workflow behavior, not just helper source shape. For browser save/retry scenarios, use the specific response and UI result; generic alert presence alone is not synchronization.
