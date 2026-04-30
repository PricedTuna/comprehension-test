import OpenAI from "openai";
import "dotenv/config";

const API_KEY = process.env.DEEPSEEK_API_KEY;

if (!API_KEY) throw Error('NO API KEY FOUND');

export const client = new OpenAI({
  apiKey: API_KEY,
  baseURL: "https://api.deepseek.com",
});

export const MODEL_NAME = "deepseek-chat";