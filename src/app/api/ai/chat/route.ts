import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAiTokensClient, getAiTokensModel } from "@/lib/ai/aitokens";
import { getChatModel } from "@/lib/ai/gemini";
import { STORE_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";

const bodySchema = z.object({
	message: z.string().min(1).max(500),
	history: z
		.array(
			z.object({
				role: z.enum(["user", "model"]),
				parts: z.array(z.object({ text: z.string() }))
			})
		)
		.max(20)
		.optional()
		.default([])
});

// Simple in-memory rate limiter: max 10 req/min per IP
const ipRequestMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
	const now = Date.now();
	const entry = ipRequestMap.get(ip);
	if (!entry || now > entry.resetAt) {
		ipRequestMap.set(ip, { count: 1, resetAt: now + 60_000 });
		return false;
	}
	if (entry.count >= 10) return true;
	entry.count += 1;
	return false;
}

export async function POST(req: NextRequest) {
	const ip = req.headers.get("x-forwarded-for") ?? "unknown";
	if (isRateLimited(ip)) {
		return NextResponse.json({ error: "Quá nhiều yêu cầu, vui lòng thử lại sau." }, { status: 429 });
	}

	const parsed = bodySchema.safeParse(await req.json());
	if (!parsed.success) {
		return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
	}

	const { message, history } = parsed.data;

	// ── Provider switch ──────────────────────────────────────────────────────────
	// Set CHAT_PROVIDER=aitokens to use aitokens.io instead of Gemini.
	// Defaults to "gemini" to keep backward compatibility.
	const provider = process.env.CHAT_PROVIDER ?? "gemini";

	if (provider === "aitokens") {
		return handleAiTokens(message, history);
	}
	return handleGemini(message, history);
}

// ── Gemini handler (original) ────────────────────────────────────────────────

async function handleGemini(
	message: string,
	history: { role: "user" | "model"; parts: { text: string }[] }[]
) {
	try {
		const model = getChatModel();
		const chat = model.startChat({
			systemInstruction: { role: "system", parts: [{ text: STORE_SYSTEM_PROMPT }] },
			history
		});

		const geminiStream = await chat.sendMessageStream(message);
		const encoder = new TextEncoder();

		const stream = new ReadableStream({
			async start(controller) {
				try {
					for await (const chunk of geminiStream.stream) {
						const text = chunk.text();
						if (text) controller.enqueue(encoder.encode(text));
					}
				} catch (streamErr) {
					console.error("[AI chat] Stream error:", streamErr);
				} finally {
					controller.close();
				}
			}
		});

		return new Response(stream, {
			headers: { "Content-Type": "text/plain; charset=utf-8" }
		});
	} catch (err) {
		console.error("[AI chat] Gemini error:", err);
		const is429 = err instanceof Error && err.message.includes("429");
		return NextResponse.json(
			{
				error: is429
					? "Trợ lý AI đang bận, vui lòng thử lại sau ít giây."
					: "Trợ lý AI tạm thời không phản hồi. Vui lòng thử lại."
			},
			{ status: 500 }
		);
	}
}

// ── AITokens handler (aitokens.io — OpenAI-compatible) ───────────────────────

type GeminiHistoryItem = { role: "user" | "model"; parts: { text: string }[] };

function toOpenAIMessages(
	history: GeminiHistoryItem[],
	message: string
): { role: "user" | "assistant" | "system"; content: string }[] {
	const msgs: { role: "user" | "assistant" | "system"; content: string }[] = [
		{ role: "system", content: STORE_SYSTEM_PROMPT }
	];
	for (const h of history) {
		msgs.push({
			// Gemini uses "model", OpenAI uses "assistant"
			role: h.role === "model" ? "assistant" : "user",
			content: h.parts.map((p) => p.text).join("")
		});
	}
	msgs.push({ role: "user", content: message });
	return msgs;
}

async function handleAiTokens(message: string, history: GeminiHistoryItem[]) {
	try {
		const client = getAiTokensClient();
		const model = getAiTokensModel();
		const messages = toOpenAIMessages(history, message);

		const stream = await client.chat.completions.create({
			model,
			messages,
			stream: true,
			max_tokens: 1024,
			temperature: 0.7
		});

		const encoder = new TextEncoder();

		const readableStream = new ReadableStream({
			async start(controller) {
				try {
					for await (const chunk of stream) {
						const delta = chunk.choices[0]?.delta?.content;
						if (delta) controller.enqueue(encoder.encode(delta));
					}
				} catch (streamErr) {
					console.error("[AI chat] AITokens stream error:", streamErr);
				} finally {
					controller.close();
				}
			}
		});

		return new Response(readableStream, {
			headers: { "Content-Type": "text/plain; charset=utf-8" }
		});
	} catch (err) {
		console.error("[AI chat] AITokens error:", err);
		const status = err instanceof Error && err.message.includes("429") ? 429 : 500;
		return NextResponse.json(
			{
				error:
					status === 429
						? "Trợ lý AI đang bận, vui lòng thử lại sau ít giây."
						: "Trợ lý AI tạm thời không phản hồi. Vui lòng thử lại."
			},
			{ status: 500 }
		);
	}
}
