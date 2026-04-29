import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

import type { ObjectNotation } from "../interfaces";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================= users-test
const usersJtonData = readFileSync(path.join(__dirname, "../raw-datasets/users-test/users-test.jton"), "utf-8");
import { users_test_questions } from "../raw-datasets/users-test/users-test.questions.ts";

// ============================= inventory
const inventoryJtonData = readFileSync(path.join(__dirname, "../raw-datasets/inventory/inventory.jton"), "utf-8");
import { inventoryQuestions } from "../raw-datasets/inventory/inventory.questions.ts";

// ============================= cipto
const ciptoJtonData = readFileSync(path.join(__dirname, "../raw-datasets/cipto/cipto.jton"), "utf-8");
import { criptoQuestions } from "../raw-datasets/cipto/cipto.questions.ts";

// ============================= systemInstruction

const systemInstruction = `
Eres un asistente experto en procesar datos en formato TRON/JTON.
Reglas de decodificación Zen Grid:
1. El formato [N: h1, h2; v1, v2; v3, v4] define una tabla de N filas.
2. La primera fila tras los dos puntos son las cabeceras (headers).
3. Las filas siguientes están separadas por punto y coma (;).
4. Los valores dentro de una fila están separados por comas (,).
`;

// ============================= datasets

const users_dataset = {
  data: usersJtonData,
  questions: users_test_questions,
};

const inventory_dataset = {
  data: inventoryJtonData,
  questions: inventoryQuestions,
};

const cipto_dataset = {
  data: ciptoJtonData,
  questions: criptoQuestions,
};

// ============================= ObjectNotation

export const JTON: ObjectNotation = {
  systemInstruction,
  datasets: [
    users_dataset,
    inventory_dataset,
    cipto_dataset
  ],
};

console.log(
  JTON.datasets.map((dataset) => dataset.data)
)