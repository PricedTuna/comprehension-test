// ANSI color codes for CLI output
export const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m',
  bgBlue: '\x1b[44m',
  white: '\x1b[37m',
};

const ASCII_HEADERS: Record<string, string> = {
  gemini: `
   ██████╗ ███████╗███╗   ███╗██╗███╗   ██╗██╗
  ██╔════╝ ██╔════╝████╗ ████║██║████╗  ██║██║
  ██║  ███╗█████╗  ██╔████╔██║██║██╔██╗ ██║██║
  ██║   ██║██╔══╝  ██║╚██╔╝██║██║██║╚██╗██║██║
  ╚██████╔╝███████╗██║ ╚═╝ ██║██║██║ ╚████║██║
   ╚═════╝ ╚══════╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝`,
  openai: `
   ██████╗ ██████╗ ███████╗███╗   ██╗
  ██╔═══██╗██╔══██╗██╔════╝████╗  ██║
  ██║   ██║██████╔╝█████╗  ██╔██╗ ██║
  ██║   ██║██╔═══╝ ██╔══╝  ██║╚██╗██║
  ╚██████╔╝██║     ███████╗██║ ╚████║
   ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═══╝`,
  local: `
  ██╗      ██████╗  ██████╗  █████╗  ██╗
  ██║     ██╔═══██╗██╔════╝ ██╔══██╗ ██║
  ██║     ██║   ██║██║      ███████║ ██║
  ██║     ██║   ██║██║      ██╔══██║ ██║
  ███████╗╚██████╔╝╚██████╗ ██║  ██║ ██████╗
  ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝`
};

const API_MESSAGES: Record<string, string> = {
  gemini: "Sending request to Gemini API...",
  openai: "Sending request to OpenAI API...",
  local: "Sending request to Local API..."
};

export function printHeader(MODEL_NAME: string, objectNotationName: string, datasetsLength: number, delayMs: number, timestamp: string, provider: string) {
  console.log(`${C.cyan}${ASCII_HEADERS[provider]}${C.reset}\n`);
  console.log(`${C.bold}${C.dim}${"─".repeat(60)}${C.reset}`);
  console.log(`${C.bold}${C.cyan}  MODEL:${C.reset} ${C.green}${MODEL_NAME}${C.reset}`);
  console.log(`${C.bold}${C.cyan}  NOTATION:${C.reset} ${C.green}${objectNotationName}${C.reset}`);
  console.log(`${C.bold}${C.cyan}  DATASETS:${C.reset} ${C.green}${datasetsLength}${C.reset}`);
  console.log(`${C.bold}${C.cyan}  DELAY:${C.reset} ${C.yellow}${delayMs}ms${C.reset}`);
  console.log(`${C.bold}${C.cyan}  TIMESTAMP:${C.reset} ${C.gray}${timestamp}${C.reset}`);
  console.log(`${C.bold}${C.dim}${"─".repeat(60)}${C.reset}\n`);
}

export function printDatasetStart(datasetName: string, questionCount: number) {
  console.log(`\n${C.bold}${C.magenta}━━━ Processing Dataset: ${datasetName} ━━━${C.reset}`);
  console.log(`${C.blue}  Questions: ${questionCount}${C.reset}\n`);
}

export function printSessionStart(sessionNumber: number, totalQuestions: number, questionKey: string) {
  console.log(`${C.bold}[${sessionNumber}/${totalQuestions}]${C.reset} ${C.cyan}Processing:${C.reset} ${C.bold}${questionKey}${C.reset}`);
}

export function printWaiting(sessionNumber: number, delayMs: number) {
  console.log(`  ${C.yellow}⏳ Waiting ${delayMs}ms for rate limit...${C.reset}`);
}

export function printSending(provider: string) {
  console.log(`  ${C.blue}🚀 ${API_MESSAGES[provider]}${C.reset}`);
}

export function printSuccess(sessionNumber: number) {
  console.log(`  ${C.green}✓ Response received successfully${C.reset}`);
}

export function printError(sessionNumber: number, message: string) {
  console.error(`${C.red}${C.bold}✗ Session ${sessionNumber}: Error - ${message}${C.reset}`);
}

export function printRetry(sessionNumber: number, status: number | string, delayMs: number, attempt: number, retries: number) {
  console.warn(`${C.yellow}${C.bold}⚠ Session ${sessionNumber}: Rate limited (${status}), retrying in ${delayMs}ms (attempt ${attempt}/${retries})${C.reset}`);
}

export function printServerError(sessionNumber: number, status: number, delayMs: number, attempt: number, retries: number) {
  console.warn(`${C.yellow}${C.bold}⚠ Session ${sessionNumber}: Server error (${status}), retrying in ${delayMs}ms (attempt ${attempt}/${retries})${C.reset}`);
}

export function printAuthError(sessionNumber: number, status: number) {
  console.error(`${C.red}${C.bold}✗ Session ${sessionNumber}: Auth/Permissions error (${status}). Check your API Key.${C.reset}`);
}

export function printResultsSaved(filePath: string) {
  console.log(`\n${C.green}${C.bold}  ✓ Results saved to: ${filePath}${C.reset}\n`);
}

export function printMaxRetriesError(sessionNumber: number) {
  throw new Error(`${C.red}${C.bold}✗ Session ${sessionNumber}: Max retries reached${C.reset}`);
}
