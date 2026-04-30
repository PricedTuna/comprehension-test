// Entry point with provider selection via CLI args
// Usage: npx ts-node --esm index.ts [--gemini|--openai|--local] [--delay <ms>]
//   --gemini, -g: Use Gemini (default)
//   --openai, -o: Use OpenAI/DeepSeek
//   --local, -l: Use Local LLM (Ollama, LM Studio, etc.)
//   --delay <ms>: Wait time between requests (default: 12000ms)

async function main() {
  const args = process.argv.slice(2);
  
  // Parse provider argument
  let provider = "gemini"; // default
  if (args.includes("--local") || args.includes("-l")) {
    provider = "local";
  } else if (args.includes("--openai") || args.includes("-o")) {
    provider = "openai";
  } else if (args.includes("--gemini") || args.includes("-g")) {
    provider = "gemini";
  }
  
  // Parse delay argument (optional)
  let delayMs = 12000; // default 12s
  const delayIndex = args.indexOf("--delay");
  if (delayIndex !== -1 && args[delayIndex + 1]) {
    const parsed = parseInt(args[delayIndex + 1], 10);
    if (!isNaN(parsed) && parsed >= 0) {
      delayMs = parsed;
    }
  }
  
  // Dynamically import based on provider
  if (provider === "local") {
    const { runComprehensionTest } = await import("./test-runner-3.ts");
    const { JSON_minimal } = await import("./object-notations/JSON.ts");
    await runComprehensionTest(JSON_minimal, delayMs);
  } else if (provider === "openai") {
    const { runComprehensionTest } = await import("./test-runner-2.ts");
    const { JSON_minimal } = await import("./object-notations/JSON.ts");
    await runComprehensionTest(JSON_minimal, delayMs);
  } else {
    const { runComprehensionTest } = await import("./test-runner.ts");
    const { JSON_minimal } = await import("./object-notations/JSON.ts");
    await runComprehensionTest(JSON_minimal, delayMs);
  }
}

main().catch(console.error);
