import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) throw Error('NO API KEY FOUND')

const genAI = new GoogleGenerativeAI(API_KEY);
export const MODEL_NAME = "gemini-2.5-pro";
export const model = genAI.getGenerativeModel({ model: MODEL_NAME });