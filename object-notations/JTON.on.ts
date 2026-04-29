import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

import type { ObjectNotation } from "../interfaces";
import { users_test_questions } from "../raw-datasets/users-test/users-test.questions";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jtonData = readFileSync(path.join(__dirname, "../raw-datasets/users-test/users-test.jton"), "utf-8");

const systemInstruction = `
Eres un asistente experto en procesar datos en formato TRON/JTON.
Reglas de decodificación Zen Grid:
1. El formato [N: h1, h2; v1, v2; v3, v4] define una tabla de N filas.
2. La primera fila tras los dos puntos son las cabeceras (headers).
3. Las filas siguientes están separadas por punto y coma (;).
4. Los valores dentro de una fila están separados por comas (,).
`

export const JTON: ObjectNotation = {
  systemInstruction,
  dataset: {
    data: jtonData,
    questions: users_test_questions,
  },
};