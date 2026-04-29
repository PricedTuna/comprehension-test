# AGENTS.md

## Project
Runs AI comprehension tests for object notations (JSON/JTON) against structured datasets using Gemini or OpenAI APIs.

## Prerequisites
- `GEMINI_API_KEY` in `.env` for Gemini (loaded via dotenv, script throws if missing)
- `DEEPSEEK_API_KEY` in `.env` for OpenAI/DeepSeek (loaded via dotenv, script throws if missing)
- Node.js, npm, TypeScript 6, ts-node

## Run
No npm scripts defined. Execute directly with provider selection:
```bash
npx ts-node --esm index.ts                    # Default: Gemini, 12s delay
npx ts-node --esm index.ts --gemini           # Gemini (explicit)
npx ts-node --esm index.ts -g                # Gemini (short)
npx ts-node --esm index.ts --openai           # OpenAI/DeepSeek
npx ts-node --esm index.ts -o                # OpenAI/DeepSeek (short)
npx ts-node --esm index.ts --delay 5000      # Custom delay (5s)
npx ts-node --esm index.ts --openai --delay 3000  # OpenAI with 3s delay
```

## Key Directories
- `object-notations/`: Notation configs (system instruction, datasets). Exported `ObjectNotation` instances (e.g., `JSON_minimal`, `JTON_on`) define test scope.
- `raw-datasets/`: Input data (`.json`/`.jton`) and `.questions.ts` files (must match `Questions` interface in `interfaces.ts`).
- `results/`: Auto-generated test logs with model name in header.

## Change Test Target
Modify the object notation import in `index.ts` (or dynamically based on provider) to switch notation/dataset set.

## Rate Limits
Script enforces 12s delay between API calls (~5 req/min) for Gemini. OpenAI/DeepSeek uses exponential backoff on 429. Retries on 429/503/403 with backoff.

## TypeScript
- Strict mode enabled, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- No build step (no `outDir`/`rootDir` set), runs directly from `.ts` files via ts-node.
