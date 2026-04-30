import { client, MODEL_NAME } from "./ai-settings-3.ts";
import type { Dataset } from "./interfaces.ts";
import OpenAI from "openai";

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
      const response = await client.chat.completions.create({
        model: MODEL_NAME,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
      });

      return {
        textResponse: response.choices[0].message.content || "",
        usageMetadata: {
          promptTokenCount: response.usage?.prompt_tokens || 0,
          candidatesTokenCount: response.usage?.completion_tokens || 0,
          totalTokenCount: response.usage?.total_tokens || 0
        },
      };

    } catch (error: any) {
      const status = error instanceof OpenAI.APIError ? error.status : undefined;

      if (status === 429) {
        console.warn(`Session ${sessionNumber}: Rate limited (429), retrying in ${delay}ms (attempt ${i + 1}/${retries})`);
        await sleep(delay);
        delay *= 2;
      } else if (status === 503 || status === 500) {
        console.warn(`Session ${sessionNumber}: Server error (${status}), retrying in ${delay}ms (attempt ${i + 1}/${retries})`);
        await sleep(delay);
        delay *= 2;
      } else if (status === 401 || status === 403) {
        console.error(`Session ${sessionNumber}: Auth/Permissions error (${status}). Check your configuration.`);
        throw error;
      } else {
        console.error(`Session ${sessionNumber}: Error - ${error.message}`);
        throw error;
      }
    }
  }

  throw new Error(`Session ${sessionNumber}: Max retries reached`);
}

export { sleep };
