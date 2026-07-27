# QuantumAI-Backend

A Node.js Express API server for AI model management and chat completions, with Zod-validated request/response handling and a contract-first OpenAPI design.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — build and run the API server (port assigned by workflow)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate Zod schemas and React Query hooks from the OpenAPI spec

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- Validation: Zod (`zod/v4`), generated schemas from `@workspace/api-zod`
- API contract: OpenAPI 3.1 → codegen via Orval
- Build: esbuild (ESM bundle)
- Logging: pino + pino-http

## Where things live

| Path | Purpose |
|---|---|
| `lib/api-spec/openapi.yaml` | Single source of truth for all API contracts |
| `lib/api-zod/src/generated/` | Zod schemas generated from the OpenAPI spec |
| `artifacts/api-server/src/routes/` | Express route handlers |
| `artifacts/api-server/src/data/models.ts` | In-memory AI model registry |

## API Endpoints

All routes are prefixed with `/api`.

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/healthz` | Liveness check |
| `GET` | `/api/v1/status` | Server name, version, uptime, memory |
| `GET` | `/api/v1/models` | List all registered AI models |
| `GET` | `/api/v1/models/:modelId` | Get a model by ID |
| `POST` | `/api/v1/chat/completions` | Submit a chat completion request |

## Registered Models

| ID | Name | Context | Capabilities |
|---|---|---|---|
| `quantum-ultra-v1` | Quantum Ultra v1 | 128k | reasoning, code, math, vision, chat |
| `quantum-core-v2` | Quantum Core v2 | 64k | chat, code, summarisation, translation |
| `quantum-flash-v1` | Quantum Flash v1 | 32k | chat, summarisation, classification |
| `quantum-code-v1` | Quantum Code v1 | 96k | code, debugging, explanation, refactoring |

## Architecture decisions

- **OpenAPI-first**: The spec in `lib/api-spec/openapi.yaml` is the single source of truth. Run codegen after every spec change — never edit generated files directly.
- **Zod on the server**: Route handlers import generated `@workspace/api-zod` schemas for both input validation and output shaping, ensuring the response always matches the spec.
- **In-memory model registry**: `src/data/models.ts` holds the model catalog. To persist models, swap this for a Drizzle ORM query against the provisioned Postgres DB.
- **Stub completions**: `POST /api/v1/chat/completions` returns deterministic stub responses. Wire up an LLM provider (e.g. OpenAI, Anthropic via Replit AI Integrations) to generate real completions.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After editing `lib/api-spec/openapi.yaml`, always run `pnpm --filter @workspace/api-spec run codegen` before restarting the server.
- Do not import `zod` with a relative path — it is listed in `artifacts/api-server/package.json` as a direct dependency.
- Restart the `artifacts/api-server: API Server` workflow (not a raw `pnpm dev` call) to pick up env vars injected by the artifact system.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
