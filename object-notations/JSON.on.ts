import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

import type { ObjectNotation } from "../interfaces";
import { users_test_questions } from "../raw-datasets/users-test/users-test.questions.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const usersTestJsonData = readFileSync(path.join(__dirname, "../raw-datasets/users-test/users-test.json"), "utf-8");
const cryptoJsonData = readFileSync(path.join(__dirname, "../raw-datasets/crypto/crypto.json"), "utf-8");
const inventoryJsonData = readFileSync(path.join(__dirname, "../raw-datasets/inventory/inventory.json"), "utf-8");

// ============================= systemInstruction

const systemInstruction = "Eres un asistente experto en procesar JSON";

// ============================= datasets

const users_dataset = {
  data: usersTestJsonData,
  questions: users_test_questions,
};

const crypto_dataset = {
  data: cryptoJsonData,
  questions: users_test_questions,
};

const inventory_dataset = {
  data: inventoryJsonData,
  questions: users_test_questions,
};

// ============================= ObjectNotation

export const JSON: ObjectNotation = {
  systemInstruction,
  datasets: [
    users_dataset, 
    crypto_dataset,
    inventory_dataset
  ],
};