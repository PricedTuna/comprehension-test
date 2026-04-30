import type { Dataset } from "./interfaces.ts";
import { provider, geminiModel, openAIClient, MODEL_NAME } from "./ai-settings.ts";
import OpenAI from "openai";

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
    // Gemini-specific logic from original ai-interaction.ts
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

          console.warn(`Session ${sessionNumber}: Rate limited (429), retrying in ${retryDelay}ms (attempt ${i + 1}/${retries})`);
          await sleep(retryDelay);
        } else if (status === 503) {
          console.warn(`Session ${sessionNumber}: Service unavailable (503), retrying in ${delay}ms (attempt ${i + 1}/${retries})`);
          await sleep(delay);
          delay *= 2;
        } else if (status === 403) {
          console.warn(`Session ${sessionNumber}: Forbidden (403), retrying in ${delay}ms (attempt ${i + 1}/${retries})`);
          await sleep(delay);
          delay *= 2;
        } else {
          throw error;
        }
      }
    }
  } else {
    // OpenAI/Local logic from ai-interactions-2.ts and -3.ts
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
          console.error(`Session ${sessionNumber}: Auth/Permissions error (${status}). Check your API Key.`);
          throw error;
        } else {
          console.error(`Session ${sessionNumber}: Error - ${error.message}`);
          throw error;
        }
      }
    }
  }

  throw new Error(`Session ${sessionNumber}: Max retries reached`);
}

export { sleep };
