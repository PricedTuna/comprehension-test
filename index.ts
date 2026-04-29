import type { ObjectNotation } from "./interfaces.ts";
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from "url";
import { JSON_minimal } from "./object-notations/JSON.ts";
import { getSessionPrompt, getAIResponse, sleep } from "./ai-interaction.ts";
import { buildHeader, buildSuccessSession, buildErrorSession } from "./markdown-builder.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESULTS_DIR = path.join(__dirname, "results");

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

      try {
        console.log(`Session ${sessionNumber}/${questionKeys.length}: Processing "${questionKey}"`);
        console.log(`Session ${sessionNumber}: Waiting 12s for rate limit...`);
        await sleep(12000);

        console.log(`Session ${sessionNumber}: Sending request to Gemini API...`);
        const { textResponse, usageMetadata } = await getAIResponse(
          prompt,
          objectNotation.systemInstruction,
          sessionNumber
        );

        console.log(`Session ${sessionNumber}: Response received successfully`);

        let sessionTokens = 0;
        if (usageMetadata) {
          sessionTokens = (usageMetadata.promptTokenCount || 0) + (usageMetadata.candidatesTokenCount || 0);
          totalTokens += sessionTokens;
        }

        fullLog += buildSuccessSession(
          sessionNumber,
          questionKey as string,
          question,
          objectNotation.name,
          dataset.data,
          prompt,
          textResponse,
          usageMetadata,
          sessionTokens
        );

        conversationHistory.push({ prompt, response: textResponse, usageMetadata });

      } catch (error: any) {
        console.error(`Session ${sessionNumber}: Error - ${error.message}`);
        fullLog += buildErrorSession(sessionNumber, questionKey as string, error.message);
        continue;
      }
    }

    const timestamp = new Date().toISOString().replace(/:/g, "-").replace(/\./g, "_");
    const filename = `${objectNotation.name}_${dataset.name}_${timestamp}.md`;
    const filePath = path.join(RESULTS_DIR, filename);

    const header = buildHeader(
      objectNotation.name,
      dataset.name,
      totalTokens,
      timestamp
    );

    fullLog = header + fullLog;

    await fs.writeFile(filePath, fullLog);
    console.log(`Results saved to: ${filePath}`);
  }
}

runComprehensionTest(JSON_minimal);
