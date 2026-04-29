import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

import type { ObjectNotation } from "../interfaces";
import { users_test_questions } from "../raw-datasets/users-test/users-test.questions.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonData = readFileSync(path.join(__dirname, "../raw-datasets/users-test/users-test.json"), "utf-8");

export const JSON: ObjectNotation = {
  systemInstruction: "Eres un asistente experto en procesar JSON",
  dataset: {
    data: jsonData,
    questions: users_test_questions,
  },
};