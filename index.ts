import { initialize as initAISettings } from "./ai-settings.ts";
import { runComprehensionTest } from "./test-runner.ts";
import { JSON_minimal } from "./object-notations/JSON.ts";

async function main() {
  const args = process.argv.slice(2);
  
  let provider = "gemini";
  if (args.includes("--local") || args.includes("-l")) {
    provider = "local";
  } else if (args.includes("--openai") || args.includes("-o")) {
    provider = "openai";
  } else if (args.includes("--gemini") || args.includes("-g")) {
    provider = "gemini";
  }
  
  let delayMs = 12000;
  const delayIndex = args.indexOf("--delay");
  if (delayIndex !== -1) {
    const argValue = args[delayIndex + 1];
    if (argValue) {
      const parsed = parseInt(argValue, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        delayMs = parsed;
      }
    }
  }
  
  initAISettings(provider);
  
  await runComprehensionTest(JSON_minimal, delayMs);
}

main().catch(console.error);
