import { GoogleGenerativeAI } from "@google/generative-ai";

function getGeminiClient(): GoogleGenerativeAI {
	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) {
		throw new Error("GEMINI_API_KEY is not set");
	}
	return new GoogleGenerativeAI(apiKey);
}

export function getChatModel() {
	const client = getGeminiClient();
	return client.getGenerativeModel({ model: "gemini-2.5-flash" });
}
