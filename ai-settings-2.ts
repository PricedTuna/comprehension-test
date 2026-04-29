import OpenAI from "openai";
// import "dotenv/config";

// const API_KEY = process.env.DEEPSEEK_API_KEY;

// if (!API_KEY) throw Error('NO API KEY FOUND');

// Configuración para DeepSeek (o cualquier provider OpenAI-compatible)
// export const client = new OpenAI({
  // apiKey: API_KEY,
  // baseURL: "https://api.deepseek.com", // Cambiar según el proveedor
// });

// Definimos el nombre del modelo como constante para facilitar cambios
// export const MODEL_NAME = "deepseek-chat";

// ==================== Local:
export const client = new OpenAI({
  apiKey: 'ollama', 
  baseURL: "http://localhost:11434/v1", // La ruta /v1 es clave para la compatibilidad
});

// // Usa el nombre exacto de tu 'ollama list'
export const MODEL_NAME = "llama3:latest";