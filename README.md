# pulsewatch

Multi-region uptime & latency monitoring. Turborepo (pnpm) monorepo containing
the marketing site, the product dashboard, and the backend that runs the
checks.

**Flow:** `apps/web` (landing page) → "Start Monitoring" → `apps/dashboard`
(the product) → talks to `apps/api`, which is backed by `apps/worker` polling
your monitors and `packages/db`/`packages/queue` underneath.

```
apps/
  web/         Next.js — marketing landing page                    :3000
  dashboard/   Next.js — the actual product (monitors, charts)      :3001
  api/         Express — Monitor CRUD + schedules checks            :4000
  worker/      BullMQ consumer — runs the HTTP checks, writes Check rows
packages/
  db/          Prisma schema + shared PrismaClient
  queue/       Shared BullMQ/ioredis config (queue name, job shape)
```

`apps/web` and `apps/dashboard` are plain Next.js apps that only ever talk to
`apps/api` over HTTP (`NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_APP_URL`) — they
don't import Prisma or anything backend-specific, so they can be deployed
completely independently of the backend (e.g. on Vercel) with zero coupling.

---

## Quick start — everything at once

### 1. Prerequisites

- Node.js ≥ 18.17
- pnpm (`npm install -g pnpm` if you don't have it)
- Docker (for local Postgres + Redis)

### 2. Install

```bash
pnpm install
```

### 3. Start Postgres + Redis

```bash
pnpm docker:up
```

### 4. Configure environment

Each backend process reads its own `.env` from its working directory; the
frontends read `.env.local`. Defaults already match `docker-compose.yml` and
each other, so nothing needs editing for local dev:

```bash
cp packages/db/.env.example packages/db/.env
cp apps/api/.env.example apps/api/.env
cp apps/worker/.env.example apps/worker/.env
cp apps/web/.env.example apps/web/.env.local
cp apps/dashboard/.env.example apps/dashboard/.env.local
```

### 5. Generate the Prisma client and run migrations

```bash
pnpm db:generate
pnpm db:migrate     # prompts for a migration name on first run, e.g. "init"
```

> This needs internet access to download Prisma's query-engine binary the
> first time. Behind a restrictive proxy/sandbox and it fails with a
> checksum/403 error? Retry with
> `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 pnpm db:generate`.

### 6. Run everything

```bash
pnpm dev
```

`turbo run dev` starts all four apps in parallel with hot reload: web on
`:3000`, dashboard on `:3001`, api on `:4000`, and the worker (no port, just
consumes the queue). Open **http://localhost:3000**, click "Start Monitoring",
add a monitor from `:3001` — within its interval you'll see `Check` rows
appear and the dashboard update on its next 15s poll.

To run a subset:

```bash
pnpm dev:web         # just the landing page
pnpm dev:dashboard    # just the dashboard (point NEXT_PUBLIC_API_URL at a
                      # deployed API if you don't want the backend running locally)
pnpm dev:backend      # just api + worker
```

---

## apps/web — landing page

Hero background (`CRTWarp`, Three.js) and cursor trail (`GlowCursor`, ogl) are
real WebGL shader components, not placeholders — see `apps/web/README.md`-
style notes inline in `components/`. `StartMonitoringButton` just links to
`NEXT_PUBLIC_APP_URL` (the dashboard) — no backend calls of its own.

## apps/dashboard — the product

- **Overview** (`/`) — stat cards + monitor table, backed by `GET /monitors`
  plus a `GET /monitors/:id/checks?limit=20` sample per monitor (status,
  latency, uptime, sparkline). Polls every 15s.
- **Monitor detail** (`/monitors/[id]`) — fetches its own larger check window
  (`limit=200`) directly for an accurate chart, independent of the overview's
  lighter sample.
- **Add monitor** (`/monitors/new`) — `POST /monitors`.
- A monitor with zero checks yet shows as **pending** rather than being
  assumed up — the worker hasn't polled it on its first interval yet.
- `lib/api.ts` is the entire integration surface. Swapping the backend or
  adding auth headers means editing one file.

## apps/api + apps/worker — the backend

Everything below is unchanged from the backend as designed — see inline
comments in `apps/api/src/services/scheduler.service.ts` for how the
BullMQ-repeatable-jobs scheduler works, and `apps/worker/src/checker.ts` for
the actual HTTP check logic.

### Data model

```prisma
model Monitor {
  id                 String   @id @default(cuid())
  name               String
  url                String
  regions            String[]   // e.g. ["us-east", "eu-west", "ap-south"]
  expectedStatusCode Int      @default(200)
  intervalSeconds    Int      @default(60)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  checks             Check[]
}

model Check {
  id         String      @id @default(cuid())
  monitorId  String
  region     String
  status     CheckStatus // UP | DOWN
  latencyMs  Int
  statusCode Int?
  checkedAt  DateTime    @default(now())
}
```

### API

| Method | Path                             | Description                          |
|--------|-----------------------------------|---------------------------------------|
| GET    | `/health`                          | DB connectivity check                 |
| GET    | `/monitors`                        | List all monitors                     |
| POST   | `/monitors`                        | Create a monitor                      |
| GET    | `/monitors/:id`                    | Get one monitor                       |
| PATCH  | `/monitors/:id`                    | Update a monitor (partial)            |
| DELETE | `/monitors/:id`                    | Delete a monitor                      |
| GET    | `/monitors/:id/checks?limit=50`    | Recent checks for a monitor           |

`POST /monitors` body:

```json
{
  "name": "Production API",
  "url": "https://api.example.com/health",
  "regions": ["us-east", "eu-west"],
  "expectedStatusCode": 200,
  "intervalSeconds": 60
}
```

Validation via `zod`; invalid bodies get `400` with a `details` field.
`expectedStatusCode` (default `200`) and `intervalSeconds` (default `60`, min
`10`) are optional. CORS is wide open by default — set `CORS_ORIGIN`
(comma-separated) in production to restrict it to your web/dashboard URLs.

### Other useful scripts

```bash
pnpm db:studio     # Prisma Studio GUI on the local DB
pnpm typecheck     # tsc --noEmit across every package/app
pnpm docker:down   # stop Postgres + Redis
```

---

## Deploying

**apps/web + apps/dashboard** are ordinary Next.js apps — deploy each to
Vercel (or any Node host) with its root directory set to `apps/web` /
`apps/dashboard`. Vercel auto-detects the pnpm workspace. Set
`NEXT_PUBLIC_APP_URL` on web and `NEXT_PUBLIC_API_URL` on dashboard to your
deployed URLs.

**apps/api + apps/worker + Postgres + Redis** — `docker-compose.prod.yml`
builds and runs all four as one stack on a single host:

```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml run --rm migrate   # first time, and after schema changes
```

`apps/api/Dockerfile` and `apps/worker/Dockerfile` use `turbo prune` so each
image only contains that app plus the workspace packages it actually depends
on — not the whole monorepo. Either image also builds standalone
(`docker build -f apps/api/Dockerfile .` from the repo root) if you'd rather
run api/worker on separate hosts (Railway, Fly, Render, ECS, …) — just point
`DATABASE_URL`/`REDIS_URL` at managed Postgres/Redis instead of the compose
services.

## Notes / known limitations

- **No auth yet** — add middleware in `apps/api/src/middleware` and wire it
  into `app.ts` when ready; the dashboard's `lib/api.ts` is the one place a
  frontend auth header would need to be added.
- **Dashboard's overview stats are sampled**, not full history — the table
  fetches the last 20 checks per monitor to keep the list fast. The detail
  page fetches 200 for an accurate chart. A real aggregation endpoint
  (`GET /monitors/:id/stats`) would remove the need for this if the check
  volume grows large enough for it to matter.
- **Regions are free-text strings**, not an enum, on purpose — new regions
  don't need a migration. The dashboard's "add monitor" form just suggests
  five (`iad1`, `fra1`, `sin1`, `lhr1`, `gru1`); the API accepts any
  non-empty string.
- **No retries** — a failed HTTP check is recorded as `DOWN` rather than
  retried, since a retry would blur latency measurements.
- **api/worker run via `tsx`** (transpile-at-runtime), not a compiled `dist/`
  build — fine for the Docker images above (`pnpm start` runs cleanly there
  since `prisma generate` is baked in at build time, no network needed at
  container boot) and for small-to-medium scale. If you run `pnpm start`
  outside Docker, run `pnpm db:generate` once as part of your deploy step
  first — `start` deliberately doesn't chain it (unlike `dev`), so production
  boot never depends on reaching Prisma's binary CDN at runtime.
- **`docker-compose.prod.yml` is a separate stack from `docker-compose.yml`**
  (its own Compose project name), so running both from the same directory —
  dev's local Postgres/Redis and the full prod stack — never collides on
  containers or volumes. They're alternatives, not layers: pick one per
  environment.
