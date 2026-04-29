# AI Comprehension Test

Runs AI comprehension tests for object notations (JSON/JTON) against structured datasets using Gemini or OpenAI/DeepSeek APIs.

## Features

- **Multi-provider support**: Run tests with Gemini or OpenAI-compatible APIs (DeepSeek, etc.)
- **Big ASCII logos**: Visual confirmation of which model is running
- **Detailed markdown reports**: Auto-generated test logs with model name, tokens, and full prompts/responses
- **Rate limiting**: Configurable delay between requests to respect API limits
- **Automatic retries**: Exponential backoff on 429/503/403 errors
- **Dynamic provider selection**: Switch providers via CLI arguments

## Prerequisites

- `GEMINI_API_KEY` in `.env` for Gemini
- `DEEPSEEK_API_KEY` in `.env` for OpenAI/DeepSeek
- Node.js, npm, TypeScript 6, ts-node
- `.env` file with your API keys (loaded via dotenv)

## Installation

```bash
npm install
```

Create a `.env` file in the project root:
```
GEMINI_API_KEY=your_gemini_key_here
DEEPSEEK_API_KEY=your_deepseek_key_here
```

## Usage

No npm scripts defined. Execute directly with provider selection:

```bash
# Default: Gemini with 12s delay
npx ts-node --esm index.ts

# Explicit Gemini
npx ts-node --esm index.ts --gemini
npx ts-node --esm index.ts -g

# OpenAI/DeepSeek
npx ts-node --esm index.ts --openai
npx ts-node --esm index.ts -o

# Custom delay (in milliseconds)
npx ts-node --esm index.ts --delay 5000      # 5s delay
npx ts-node --esm index.ts --openai --delay 3000  # OpenAI with 3s delay
```

### CLI Options

| Flag | Short | Description |
|------|-------|-------------|
| `--gemini` | `-g` | Use Gemini (default) |
| `--openai` | `-o` | Use OpenAI/DeepSeek |
| `--delay <ms>` | - | Wait time between requests (default: 12000ms) |

## Project Structure

```
comprehension-test/
├── index.ts                    # Entry point with CLI arg parsing
├── index-2.ts                  # OpenAI-specific entry point (legacy)
├── test-runner.ts              # Gemini test runner with ASCII art
├── test-runner-2.ts            # OpenAI test runner with ASCII art
├── ai-interaction.ts           # Gemini API interactions
├── ai-interactions-2.ts        # OpenAI API interactions
├── ai-settings.ts              # Gemini configuration (model, API key)
├── ai-settings-2.ts            # OpenAI configuration (model, API key)
├── markdown-builder.ts         # Generates markdown test reports
├── interfaces.ts               # TypeScript interfaces
├── object-notations/           # Notation configs (system instruction, datasets)
│   ├── JSON.ts                 # JSON notation example
│   └── ...                     # Other notations (JTON, etc.)
├── raw-datasets/               # Input data and questions
│   ├── *.json                  # Dataset files
│   ├── *.jton                  # JTON dataset files
│   └── *.questions.ts          # Questions (must match Questions interface)
└── results/                    # Auto-generated test logs
    └── <notation>_<timestamp>/ # Folder per test run
        └── <dataset>.md        # Markdown report with model info
```

## Changing Test Target

Modify the object notation import in `index.ts` to switch notation/dataset set:

```typescript
// In index.ts, change the dynamic import:
const { JSON_minimal } = await import("./object-notations/JSON.ts");
```

Available notations are exported from files in `object-notations/` (e.g., `JSON_minimal`, `JTON_on`).

## Rate Limits

- **Gemini**: Script enforces delay between API calls (default 12s, ~5 req/min)
- **OpenAI/DeepSeek**: Uses exponential backoff on 429 errors
- Both: Retries on 429/503/403 with backoff

Adjust delay with `--delay <ms>` to avoid 429 errors.

## Markdown Reports

Each test generates a markdown file in `results/` with:

- **Model name** at the top
- Object notation used
- Dataset name
- Total tokens consumed
- Timestamp
- Questions and AI answers
- Full prompts sent
- Usage metadata (tokens per request)

## TypeScript Configuration

- Strict mode enabled
- `noUncheckedIndexedAccess`
- `exactOptionalPropertyTypes`
- No build step (runs directly from `.ts` files via ts-node)

## Example Output

When running, you'll see:

```
   ██████╗ ███████╗███╗   ███╗██╗███╗   ██╗██╗
  ██╔════╝ ██╔════╝████╗ ████║██║████╗  ██║██║
  ██║  ███╗█████╗  ██╔████╔██║██║██╔██╗ ██║██║
  ██║   ██║██╔══╝  ██║╚██╔╝██║██║██║╚██╗██║██║
  ╚██████╔╝███████╗██║ ╚═╝ ██║██║██║ ╚████║██║
   ╚═════╝ ╚══════╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝

============================================================
  MODEL: gemini-2.5-pro
  NOTATION: JSON_minimal
  DATASETS: 2
  DELAY: 12000ms
  TIMESTAMP: 2026-04-29T12-00-00-000Z
============================================================

Processing dataset: example_dataset (5 questions)
Session 1/5: Processing "question_key"
Session 1: Waiting 12000ms for rate limit...
Session 1: Sending request to Gemini API...
Session 1: Response received successfully
...
```
