import type { Questions } from "./interfaces";

export function listQuestions(questions: Questions) {
  return Object.values(questions)
    .map((question, index) => `${index + 1}. ${question}`)
    .join("\n");
}
