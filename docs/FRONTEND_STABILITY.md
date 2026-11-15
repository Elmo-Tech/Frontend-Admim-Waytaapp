# Frontend stability — 2026-11-15

Scope: `platform` frontend only. No API, database, operations infrastructure, credentials, API contract, deployment, commit or push changes. Real backend integration is explicitly excluded by the user's instruction.

## Implemented

- Package create/update/status/delete actions share a synchronous exclusive-task guard. Failures preserve form values and release the guard for retry.
- Failed package-detail reads expose a retry action and preserve existing cancellation of obsolete reads.
- Route and root error boundaries provide an English/Arabic retry UI independent of application providers. Client exceptions and unhandled rejections publish `wayta:client-error` with metadata only (source, error name, optional digest) and log that metadata to the browser console. No external monitoring destination is configured or contacted.
- CI explicitly checks architecture and runs a production-build Chromium suite with pinned, isolated Playwright tooling. Browser artifacts upload even after a failure.

## Validation

| Check | Status |
| --- | --- |
| Tests | PASS: 93 tests |
| Lint | PASS, no warnings |
| TypeScript | PASS |
| Architecture | PASS, including existing public-entry, cycle and server/client checks |
| Production build | PASS with `npm run build -- --webpack` and local fixture API configuration |
| Browser scripts and fixture modules | JavaScript syntax checks passed |
| Browser execution | BLOCKED locally: opening fixture HTTP ports is denied with `listen EPERM` |
| Fresh install | BLOCKED locally: offline cache is missing `zod-validation-error-4.0.2.tgz`; registry DNS is unavailable. Existing working installations were retained. |

The default Turbopack build is not claimed as verified. CI retains the default build so it is exercised on a normal runner. CI itself has not been triggered or observed in this task. Existing source-preservation checks remain; checkout assertions now check validation before the network call rather than before the loading indicator, and formatting-only assertions tolerate whitespace. New tests assert runtime behavior, not source hashes.

New behavioral tests cover overlapping mutations, rejection/retry, stale reads and safe error metadata.

The browser suite covers console routes, Arabic RTL/mobile and English/desktop, package validation/focus, rapid repeated saves, failed-save input retention, retry/exact money payload, contract draft saving, unauthenticated redirects and unreachable-session responses. Browser traffic is allowlisted to the frontend and local fixture API only. Print layout verification remains in the earlier refactor evidence and has not been repeated here.

## Reproduce browser verification

On a machine with network and permission to bind localhost ports, run from this repository:

```sh
npm ci
npm install --prefix /tmp/wayta-browser-tools --no-audit --no-fund --ignore-scripts playwright@1.62.1
node /tmp/wayta-browser-tools/node_modules/playwright/cli.js install chromium
NEXT_PUBLIC_API_URL=http://127.0.0.1:14380 NEXT_PUBLIC_API_BASE_PATH=/api/v1 npm run build
PLAYWRIGHT_MODULE=/tmp/wayta-browser-tools/node_modules/playwright/index.mjs npm run test:browser
```

The harness starts its own fixture API and production Next server, uses no account/database, blocks external browser requests, writes `test-results/browser/` and exits nonzero on failure. `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` can point to an existing Chromium executable. Production builds bake in public API configuration; rebuild with the real deployment configuration before releasing.

## Remaining verification

Run the browser suite and clean install in CI or an unrestricted development environment. Inspect mobile/RTL screenshots and confirm keyboard behavior before release. Connecting an external monitoring collector requires an actual service configuration; the capture hook alone is not operational monitoring. No claim of 100% stability, live backend verification, deployed behavior or successful CI is made.
