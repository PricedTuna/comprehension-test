import { model } from "./ai-settings.ts";
import { JSON_minimal } from "./object-notations/JSON.ts";
import type { Dataset, ObjectNotation } from "./interfaces.ts";
import * as fs from 'fs/promises';
import * as path from 'path';

import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESULTS_DIR = path.join(__dirname, "results");

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retry<T>(fn: () => Promise<T>, sessionNumber: number, retries = 5): Promise<T> {
  let delay = 2000;

  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const status = error?.status;

      if (status === 429) {
        const retryInfo = error?.errorDetails?.find((e: any) => e.retryDelay);
        const retryDelay = retryInfo
          ? parseInt(retryInfo.retryDelay.replace("s", "")) * 1000
          : delay;

        console.warn(`Session ${sessionNumber}: Rate limited (429), retrying in ${retryDelay}ms (attempt ${i+1}/${retries})`);
        await sleep(retryDelay);
      } else if (status === 503) {
        console.warn(`Session ${sessionNumber}: Service unavailable (503), retrying in ${delay}ms (attempt ${i+1}/${retries})`);
        await sleep(delay);
        delay *= 2;
      } else if (status === 403) {
        console.warn(`Session ${sessionNumber}: Forbidden (403), retrying in ${delay}ms (attempt ${i+1}/${retries})`);
        await sleep(delay);
        delay *= 2;
      } else {
        throw error;
      }
    }
  }

  throw new Error(`Session ${sessionNumber}: Max retries reached`);
}

const getSessionPrompt = (dataset: Dataset, question: string, sessionNumber: number) => {
  return `Session ${sessionNumber}:
Based on the following data:

\`\`\`
${dataset.data}
\`\`\`

answer this question: ${question}.`;
};

async function runComprehensionTest(objectNotation: ObjectNotation) {
  await fs.mkdir(RESULTS_DIR, { recursive: true });

  for (const dataset of objectNotation.datasets) {
    let conversationHistory: any[] = [];
    let fullLog = "";
    let totalTokens = 0;

    const questionKeys = Object.keys(dataset.questions) as Array<keyof typeof dataset.questions>;
    console.log(`\nProcessing dataset: ${dataset.name} (${questionKeys.length} questions)`);

    for (let i = 0; i < questionKeys.length; i++) {
      const questionKey = questionKeys[i];
      const question = dataset.questions[questionKey].question;
      const sessionNumber = i + 1;
      const prompt = getSessionPrompt(dataset, question, sessionNumber);

      fullLog += `--- Session ${sessionNumber} ---\n`;
      fullLog += `Prompt:\n${prompt}\n\n`;

      try {
        console.log(`Session ${sessionNumber}/${questionKeys.length}: Processing "${questionKey}"`);
        console.log(`Session ${sessionNumber}: Waiting 12s for rate limit...`);
        await sleep(12000); // Rate limit (~5 req/min)

        console.log(`Session ${sessionNumber}: Sending request to Gemini API...`);
        const result = await retry(() =>
          model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            systemInstruction: objectNotation.systemInstruction,
          }),
          sessionNumber
        );

        console.log(`Session ${sessionNumber}: Response received successfully`);
        const response = result.response;
        const textResponse = response.text();
        const usageMetadata = response.usageMetadata;

        fullLog += `Response:\n${textResponse}\n\n`;

        if (usageMetadata) {
          fullLog += `Usage Metadata:\n${JSON.stringify(usageMetadata, null, 2)}\n\n`;
          totalTokens += (usageMetadata.promptTokenCount || 0) + (usageMetadata.candidatesTokenCount || 0);
        }

        fullLog += `${"=".repeat(60)}\n\n`;
        conversationHistory.push({ prompt, response: textResponse, usageMetadata });

      } catch (error: any) {
        fullLog += `ERROR in session ${sessionNumber}: ${error.message}\n\n`;
        fullLog += `${"=".repeat(60)}\n\n`;
        console.error(`Session ${sessionNumber}: Error - ${error.message}`);
        continue; // Continue instead of breaking
      }
    }

    const timestamp = new Date().toISOString().replace(/:/g, "-").replace(/\./g, "_");
    const filename = `${objectNotation.name}_${dataset.name}_${timestamp}.txt`;
    const filePath = path.join(RESULTS_DIR, filename);

    const header = `Object Notation: ${objectNotation.name}\n` +
                   `Dataset: ${dataset.name}\n` +
                   `Total Tokens Consumed: ${totalTokens}\n` +
                   `${"=".repeat(60)}\n\n`;

    fullLog = header + fullLog;

    await fs.writeFile(filePath, fullLog);
    console.log(`Results saved to: ${filePath}`);
  }
}

runComprehensionTest(JSON_minimal);