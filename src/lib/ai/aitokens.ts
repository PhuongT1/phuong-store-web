import OpenAI from "openai";

const AITOKENS_BASE_URL = "https://aitokens.io.vn/v1";

export function getAiTokensClient(): OpenAI {
	const apiKey = process.env.AITOKENS_API_KEY;
	if (!apiKey) {
		throw new Error("AITOKENS_API_KEY is not set");
	}
	return new OpenAI({ apiKey, baseURL: AITOKENS_BASE_URL });
}

/**
 * Model to use via aitokens.io.
 * Defaults to gemini-3-flash-preview (cheapest, fast).
 * Override with AITOKENS_MODEL env var.
 */
export function getAiTokensModel(): string {
	return process.env.AITOKENS_MODEL ?? "gemini-3-flash-preview";
}
