import { model } from "./ai-settings";
import { JSON } from "./object-notations/JSON";
import type { Dataset, ObjectNotation } from "./interfaces";

const getPrompt = (dataset: Dataset) => {
  return `
Utilizando los siguientes datos:
${dataset.data}

Responde las siguientes preguntas de forma precisa:
${dataset.questions}
`
}

async function runComprehensionTest(objectNotation: ObjectNotation) {
  objectNotation.datasets.forEach(async (dataset) => {
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: getPrompt(dataset) }] }],
        systemInstruction: objectNotation.systemInstruction,
      });

      const response = await result.response;
      console.log("--- Resultados de la Prueba de Comprensión ---");
      console.log(response.text());
    } catch (error) {
      console.error("Error en la prueba:", error);
    }
  });
}

runComprehensionTest(JSON);
