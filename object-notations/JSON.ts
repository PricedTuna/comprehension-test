import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

import type { ObjectNotation } from "../interfaces.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================= users-test
const usersTestJsonData = readFileSync(path.join(__dirname, "../raw-datasets/users-test/users-test.json"), "utf-8");
import { users_test_questions } from "../raw-datasets/users-test/users-test.questions.ts";

// ============================= cripto
const criptoJsonData = readFileSync(path.join(__dirname, "../raw-datasets/cripto/cripto.json"), "utf-8");
import { criptoQuestions } from "../raw-datasets/cripto/cripto.questions.ts";

// ============================= inventory
const inventoryJsonData = readFileSync(path.join(__dirname, "../raw-datasets/inventory/inventory.json"), "utf-8");
import { inventoryQuestions } from "../raw-datasets/inventory/inventory.questions.ts";

// ============================= systemInstruction

const systemInstruction = "Eres un asistente experto en procesar JSON";

// ============================= datasets

const users_dataset = {
  name: "users_test",
  data: usersTestJsonData,
  questions: users_test_questions,
};

const cripto_dataset = {
  name: "cripto",
  data: criptoJsonData,
  questions: criptoQuestions,
};

const inventory_dataset = {
  name: "inventory",
  data: inventoryJsonData,
  questions: inventoryQuestions,
};

// ============================= ObjectNotation

export const JSON_on: ObjectNotation = {
  name: "JSON",
  systemInstruction,
  datasets: [
    users_dataset, 
    cripto_dataset,
    inventory_dataset
  ],
};

export const JSON_minimal: ObjectNotation = {
  name: "JSON_minimal",
  systemInstruction,
  datasets: [
    users_dataset
  ],
};