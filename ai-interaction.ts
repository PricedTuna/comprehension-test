import { model } from "./ai-settings.ts";
import type { Dataset } from "./interfaces.ts";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getSessionPrompt = (dataset: Dataset, question: string, sessionNumber: number): string => {
  return `Session ${sessionNumber}:
Based on the following data:

\`\`\`
${dataset.data}
\`\`\`

answer this question: ${question}.`;
};

export async function getAIResponse(
  prompt: string,
  systemInstruction: string,
  sessionNumber: number,
  retries = 5
): Promise<{ textResponse: string; usageMetadata: any }> {
  let delay = 2000;

  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent({
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

export { sleep };
