# AGENTS.md

## Project
Runs AI comprehension tests for object notations (JSON/JTON) against structured datasets using Gemini API.

## Prerequisites
- `GEMINI_API_KEY` in `.env` (loaded via dotenv, script throws if missing)
- Node.js, npm, TypeScript 6, ts-node

## Run
No npm scripts defined. Execute directly:
```bash
npx ts-node --esm index.ts
```

## Key Directories
- `object-notations/`: Notation configs (system instruction, datasets). Exported `ObjectNotation` instances (e.g., `JSON_minimal`, `JTON_on`) define test scope.
- `raw-datasets/`: Input data (`.json`/`.jton`) and `.questions.ts` files (must match `Questions` interface in `interfaces.ts`).
- `results/`: Auto-generated test logs.

## Change Test Target
`index.ts` imports a specific `ObjectNotation` instance (default: `JSON_minimal`) passed to `runComprehensionTest`. Update this import to switch notation/dataset set.

## Rate Limits
Script enforces 12s delay between API calls (~5 req/min) for Gemini. Retries on 429/503/403 with backoff. Do not reduce delay to avoid 429 errors.

## TypeScript
- Strict mode enabled, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- No build step (no `outDir`/`rootDir` set), runs directly from `.ts` files via ts-node.
