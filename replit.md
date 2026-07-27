# QuantumAI-Backend

A minimal Node.js Express server with a single `POST /api/chat` endpoint connected to the Google Gemini API.

## Run

- `pnpm --filter @workspace/api-server run dev` — build and start the server
- `pnpm --filter @workspace/api-spec run codegen` — regenerate Zod schemas after editing `openapi.yaml`

## Stack

- Node.js 24, TypeScript 5.9, Express 5
- Google Gemini (`gemini-2.5-flash`) via `@google/genai`
- Zod request/response validation (schemas generated from OpenAPI spec)
- pino structured logging

## Endpoint

### `POST /api/chat`

**Request**
```json
{ "message": "Your question here" }
```

**Response**
```json
{ "reply": "Gemini's answer" }
```

**Errors** — `400` for missing/empty message, `500` for Gemini failures.

## Environment

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key (set as a Replit secret) |
| `PORT` | Assigned automatically by the workflow |

## Where things live

| Path | Purpose |
|---|---|
| `artifacts/api-server/src/routes/chat.ts` | The `/chat` route handler |
| `lib/api-spec/openapi.yaml` | API contract (source of truth) |
| `lib/api-zod/src/generated/api.ts` | Generated Zod schemas — do not edit |

## Gotchas

- After editing `openapi.yaml`, run codegen before restarting the server.
- The codegen script rewrites `lib/api-zod/src/index.ts` to avoid a name-clash between Orval's Zod output and its TypeScript types output — do not restore the types barrel.
