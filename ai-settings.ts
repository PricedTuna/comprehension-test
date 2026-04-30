import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import "dotenv/config";

let provider: 'gemini' | 'openai' | 'local' = 'gemini';
let MODEL_NAME = "gemini-2.5-pro";
let geminiModel: ReturnType<GoogleGenerativeAI['getGenerativeModel']> | null = null;
let openAIClient: OpenAI | null = null;

export function initialize(providerInput: string) {
  const normalizedProvider = providerInput.toLowerCase();
  if (!['gemini', 'openai', 'local'].includes(normalizedProvider)) {
    throw new Error(`Invalid provider: ${providerInput}. Must be gemini, openai, or local.`);
  }
  provider = normalizedProvider as 'gemini' | 'openai' | 'local';

  if (provider === 'gemini') {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) throw new Error('NO GEMINI API KEY FOUND');
    const genAI = new GoogleGenerativeAI(API_KEY);
    geminiModel = genAI.getGenerativeModel({ model: MODEL_NAME });
    openAIClient = null;
  } else if (provider === 'openai') {
    const API_KEY = process.env.DEEPSEEK_API_KEY;
    if (!API_KEY) throw new Error('NO DEEPSEEK API KEY FOUND');
    openAIClient = new OpenAI({
      apiKey: API_KEY,
      baseURL: "https://api.deepseek.com",
    });
    MODEL_NAME = "deepseek-chat";
    geminiModel = null;
  } else if (provider === 'local') {
    const BASE_URL = process.env.LOCAL_BASE_URL || "http://localhost:11434/v1";
    const MODEL = process.env.LOCAL_MODEL_NAME || "llama3:latest";
    const API_KEY = process.env.LOCAL_API_KEY || "ollama";
    openAIClient = new OpenAI({
      apiKey: API_KEY,
      baseURL: BASE_URL,
    });
    MODEL_NAME = MODEL;
    geminiModel = null;
  }
}

export { provider, MODEL_NAME, geminiModel, openAIClient };
