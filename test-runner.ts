import type { ObjectNotation } from "./interfaces.ts";
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from "url";
import { getSessionPrompt, getAIResponse, sleep } from "./ai-interaction.ts";
import { MODEL_NAME } from "./ai-settings.ts";
import {
  type SessionData,
  buildHeader,
  buildQuestionsAndAnswersSection,
  buildDetailsSection,
  buildCompleteMarkdown
} from "./markdown-builder.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESULTS_DIR = path.join(__dirname, "results");

export async function runComprehensionTest(objectNotation: ObjectNotation) {
  const timestamp = new Date().toISOString().replace(/:/g, "-").replace(/\./g, "_");
  const folderName = `${objectNotation.name}_${timestamp}`;
  const folderPath = path.join(RESULTS_DIR, folderName);

  console.log("\n   ██████╗ ███████╗███╗   ███╗██╗███╗   ██╗██╗");
  console.log("  ██╔════╝ ██╔════╝████╗ ████║██║████╗  ██║██║");
  console.log("  ██║  ███╗█████╗  ██╔████╔██║██║██╔██╗ ██║██║");
  console.log("  ██║   ██║██╔══╝  ██║╚██╔╝██║██║██║╚██╗██║██║");
  console.log("  ╚██████╔╝███████╗██║ ╚═╝ ██║██║██║ ╚████║██║");
  console.log("   ╚═════╝ ╚══════╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝");
  console.log("\n" + "=".repeat(60));
  console.log(`  MODEL: ${MODEL_NAME}`);
  console.log(`  NOTATION: ${objectNotation.name}`);
  console.log(`  DATASETS: ${objectNotation.datasets.length}`);
  console.log(`  TIMESTAMP: ${timestamp}`);
  console.log("=".repeat(60) + "\n");

  await fs.mkdir(folderPath, { recursive: true });

  for (const dataset of objectNotation.datasets) {
    const sessionDataArray: SessionData[] = [];
    let totalTokens = 0;

    const questionKeys = Object.keys(dataset.questions) as Array<keyof typeof dataset.questions>;
    console.log(`\nProcessing dataset: ${dataset.name} (${questionKeys.length} questions)`);

    for (let i = 0; i < questionKeys.length; i++) {
      const questionKey = questionKeys[i];
      const questionObj = dataset.questions[questionKey];
      const question = questionObj.question;
      const datasetAnswer = questionObj.answer;
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

        sessionDataArray.push({
          sessionNumber,
          questionKey: questionKey as string,
          question,
          datasetAnswer,
          aiAnswer: textResponse,
          sessionTokens,
          objectNotationName: objectNotation.name,
          datasetData: dataset.data,
          prompt,
          usageMetadata,
        });

      } catch (error: any) {
        console.error(`Session ${sessionNumber}: Error - ${error.message}`);
        sessionDataArray.push({
          sessionNumber,
          questionKey: questionKey as string,
          question,
          datasetAnswer: questionObj.answer,
          aiAnswer: `**ERROR**: ${error.message}`,
          sessionTokens: 0,
          objectNotationName: objectNotation.name,
          datasetData: dataset.data,
          prompt,
          usageMetadata: null,
        });
        continue;
      }
    }

    const filename = `${dataset.name}.md`;
    const filePath = path.join(folderPath, filename);

    const header = buildHeader(
      objectNotation.name,
      dataset.name,
      totalTokens,
      timestamp,
      MODEL_NAME
    );

    const questionsAndAnswers = buildQuestionsAndAnswersSection(sessionDataArray);
    const details = buildDetailsSection(sessionDataArray);
    const fullLog = buildCompleteMarkdown(header, questionsAndAnswers, details);

    await fs.writeFile(filePath, fullLog);
    console.log(`Results saved to: ${filePath}`);
  }
}
