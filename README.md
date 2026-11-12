# Wayta Platform Console

Standalone Next.js App Router application for the platform team. Node >=24 <25; npm 11.12.1.

## Local development (PowerShell)

```powershell
Copy-Item .env.example .env
npm ci
npm run dev
```

Runs at http://localhost:3001. Start the API separately and configure its PLATFORM_ORIGIN appropriately.
Set NEXT_PUBLIC_API_URL and NEXT_PUBLIC_API_BASE_PATH before building. Keep secrets out of NEXT_PUBLIC_*.
Production retains same-origin browser API routing via Nginx; API_INTERNAL_URL is server-only.

## Checks

```powershell
npm run lint
npm run typecheck
npm test
npm run check:architecture
npm run build
npm audit
npm audit --omit=dev
```

See [Architecture](docs/ARCHITECTURE.md) for module ownership and dependency rules, and
[Refactor validation](docs/REFACTOR_VALIDATION.md) for results, browser evidence and remaining development-only advisories.
Dockerfile builds from this repository root. Original business specifications and shared infrastructure remain in ../operations.
No commit or remote was created by the refactor.
