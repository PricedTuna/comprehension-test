import type { Dataset } from "./interfaces.ts";
import { provider, geminiModel, openAIClient, MODEL_NAME } from "./ai-settings.ts";
import OpenAI from "openai";
import {
  C,
  printRetry,
  printServerError,
  printAuthError
} from "./cli-logger.ts";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getSessionPrompt = (dataset: Dataset, question: string, sessionNumber: number): string => {
  return `
Based on the following data:

\`\`\`
${dataset.data}
\`\`\`

Answer the following question:

${question}

IMPORTANT RULES:
- Return ONLY the final answer
- Do NOT include explanations
- Do NOT include extra text
- Do NOT repeat the question
`;
};

export async function getAIResponse(
  prompt: string,
  systemInstruction: string,
  sessionNumber: number,
  retries = 5
): Promise<{ textResponse: string; usageMetadata: any }> {
  let delay = 2000;

  if (provider === 'gemini') {
    for (let i = 0; i < retries; i++) {
      try {
        const result = await geminiModel!.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          systemInstruction,
        });

        const response = result.response;
        return {
          textResponse: response.text(),
          usageMetadata: response.usageMetadata,
        };
      } catch (error: any) {
        const status = error?.status;

        if (status === 429) {
          const retryInfo = error?.errorDetails?.find((e: any) => e.retryDelay);
          const retryDelay = retryInfo
            ? parseInt(retryInfo.retryDelay.replace("s", "")) * 1000
            : delay;

          printRetry(sessionNumber, 429, retryDelay, i + 1, retries);
          await sleep(retryDelay);
        } else if (status === 503) {
          printServerError(sessionNumber, 503, delay, i + 1, retries);
          await sleep(delay);
          delay *= 2;
        } else if (status === 403) {
          printRetry(sessionNumber, 403, delay, i + 1, retries);
          await sleep(delay);
          delay *= 2;
        } else {
          throw error;
        }
      }
    }
  } else {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await openAIClient!.chat.completions.create({
          model: MODEL_NAME,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: prompt }
          ],
          temperature: 0.3,
        });

        const choice = response.choices[0];
        if (!choice) throw new Error('No response from API');

        return {
          textResponse: choice.message.content || "",
          usageMetadata: {
            promptTokenCount: response.usage?.prompt_tokens || 0,
            candidatesTokenCount: response.usage?.completion_tokens || 0,
            totalTokenCount: response.usage?.total_tokens || 0
          },
        };
      } catch (error: any) {
        const status = error instanceof OpenAI.APIError ? error.status : undefined;

        if (status === 429) {
          printRetry(sessionNumber, 429, delay, i + 1, retries);
          await sleep(delay);
          delay *= 2;
        } else if (status === 503 || status === 500) {
          printServerError(sessionNumber, status, delay, i + 1, retries);
          await sleep(delay);
          delay *= 2;
        } else if (status === 401 || status === 403) {
          printAuthError(sessionNumber, status);
          throw error;
        } else {
          console.error(`${C.red}${C.bold}✗ Session ${sessionNumber}: Error - ${error.message}${C.reset}`);
          throw error;
        }
      }
    }
  }

  throw new Error(`${C.red}${C.bold}✗ Session ${sessionNumber}: Max retries reached${C.reset}`);
}

export { sleep };
