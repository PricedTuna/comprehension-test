import { model } from "./ai-settings";
import { JSON } from "./object-notations/JSON.on";
import type { ObjectNotation } from "./interfaces";



async function runComprehensionTest(objectNotation: ObjectNotation) {
  const prompt = `
  Utilizando los siguientes datos:
  ${objectNotation.dataset.data}

  Responde las siguientes preguntas de forma precisa:
  ${objectNotation.dataset.questions}
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      systemInstruction: objectNotation.systemInstruction,
    });

    const response = await result.response;
    console.log("--- Resultados de la Prueba de Comprensión ---");
    console.log(response.text());
  } catch (error) {
    console.error("Error en la prueba:", error);
  }
}

runComprehensionTest(JSON);