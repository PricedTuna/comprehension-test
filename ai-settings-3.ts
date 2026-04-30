import OpenAI from "openai";
import "dotenv/config";

const BASE_URL = process.env.LOCAL_BASE_URL || "http://localhost:11434/v1";
const MODEL = process.env.LOCAL_MODEL_NAME || "llama3:latest";
const API_KEY = process.env.LOCAL_API_KEY || "ollama";

export const client = new OpenAI({
  apiKey: API_KEY,
  baseURL: BASE_URL,
});

export const MODEL_NAME = MODEL;
