# Standalone Wayta repository

This repository was extracted at the user's explicit request on 2026-11-12.
Use npm and Node >=24 <25. This repository is NOT an npm workspace.
All app files, package.json, package-lock.json, and .env belong at this repository root.
Do not add dependencies on sibling source repositories for build or runtime.
The backend remains authoritative for authorization, tenant scope, pricing, and business state.
Preserve the existing product behavior. Never commit or push without explicit instructions.
Run relevant tests, typecheck, lint and build for changes.
Read docs/ARCHITECTURE.md before frontend work. Keep app thin and use modules for business domains.
Cross-module imports use public index entries; activity/server is its explicit server-only public entry.
Shared components/lib/config/types must not depend on modules. Run npm run check:architecture.
The complete original specifications and agent rules are archived in the operations repository.
Read the relevant approved specs before feature changes. Legacy monorepo paths in those specs
are historical; the current extraction decision and README define repository layout and setup.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## AI workflow entry point

Read [AI.md](AI.md) before implementation. It routes to the repository workflow, domain rules, approved specification map, change-spec template and validation guidance under `docs/ai/`. Preserve the Next-managed instructions above. Apply the user's authorized scope and do not add backend or sibling-repository changes to a frontend task.
