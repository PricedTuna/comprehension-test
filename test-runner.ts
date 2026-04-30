import type { ObjectNotation } from "./interfaces.ts";
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from "url";
import { getSessionPrompt, getAIResponse, sleep } from "./ai-interaction.ts";
import { MODEL_NAME, provider } from "./ai-settings.ts";
import {
  type SessionData,
  buildHeader,
  buildQuestionsAndAnswersSection,
  buildDetailsSection,
  buildCompleteMarkdown
} from "./markdown-builder.ts";
import {
  printHeader,
  printDatasetStart,
  printSessionStart,
  printWaiting,
  printSending,
  printSuccess,
  printError,
  printResultsSaved
} from "./cli-logger.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESULTS_DIR = path.join(__dirname, "results");

export async function runComprehensionTest(objectNotation: ObjectNotation, delayMs: number = 12000) {
  const timestamp = new Date().toISOString().replace(/:/g, "-").replace(/\./g, "_");
  const folderName = `${objectNotation.name}_${timestamp}`;
  const folderPath = path.join(RESULTS_DIR, folderName);

  printHeader(MODEL_NAME, objectNotation.name, objectNotation.datasets.length, delayMs, timestamp, provider);

  await fs.mkdir(folderPath, { recursive: true });

  for (const dataset of objectNotation.datasets) {
    const sessionDataArray: SessionData[] = [];
    let totalTokens = 0;

    const questionKeys = Object.keys(dataset.questions) as Array<keyof typeof dataset.questions>;
    printDatasetStart(dataset.name, questionKeys.length);

    for (let i = 0; i < questionKeys.length; i++) {
      const questionKey = questionKeys[i];
      if (!questionKey) continue;

      const questionObj = dataset.questions[questionKey];
      const question = questionObj.question;
      const datasetAnswer = questionObj.answer;
      const sessionNumber = i + 1;
      const prompt = getSessionPrompt(dataset, question, sessionNumber);

      try {
        printSessionStart(sessionNumber, questionKeys.length, questionKey as string);
        printWaiting(sessionNumber, delayMs);
        await sleep(delayMs);

        printSending(provider);
        const { textResponse, usageMetadata } = await getAIResponse(
          prompt,
          objectNotation.systemInstruction,
          sessionNumber
        );

        printSuccess(sessionNumber);

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
        printError(sessionNumber, error.message);
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
    printResultsSaved(filePath);
  }
}
