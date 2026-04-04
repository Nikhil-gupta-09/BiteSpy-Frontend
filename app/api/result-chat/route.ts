import { NextResponse } from "next/server";
import type { AnalysisResult } from "@/lib/claim-analysis";
import { generateGeminiJson, GeminiConfigError } from "@/lib/gemini";

export const runtime = "nodejs";

interface ChatRequestBody {
    question?: string;
    result?: AnalysisResult;
    recentMessages?: Array<{ role?: "user" | "assistant"; text?: string }>;
}

interface ChatResponseShape {
    answer?: string;
    inScope?: boolean;
}

function compactResultContext(result: AnalysisResult) {
    return {
        productName: result.productName,
        claimOMeter: result.claimOMeter,
        verdict: result.verdict,
        personalizedSummary: result.personalizedSummary,
        falseClaims: result.falseClaims.slice(0, 6),
        harmfulIngredients: result.harmfulIngredients.slice(0, 8),
        labelAlerts: result.labelAlerts.slice(0, 8),
        goodPoints: result.goodPoints.slice(0, 8),
        recommendedLabels: result.recommendedLabels.slice(0, 8),
        ingredients: result.ingredients.slice(0, 20),
        alternatives: result.alternatives.slice(0, 6),
    };
}

export async function POST(request: Request): Promise<Response> {
    try {
        const body = (await request.json()) as ChatRequestBody;
        const question = body.question?.trim() || "";
        const result = body.result;

        if (!question) {
            return NextResponse.json({ error: "Question is required." }, { status: 400 });
        }

        if (!result?.productName || typeof result.claimOMeter !== "number") {
            return NextResponse.json({ error: "Valid result context is required." }, { status: 400 });
        }

        const recent = Array.isArray(body.recentMessages)
            ? body.recentMessages
                .slice(-8)
                .map((m) => `${m.role === "assistant" ? "assistant" : "user"}: ${(m.text || "").trim()}`)
                .filter(Boolean)
            : [];

        const prompt = `
You are Detective Raccoon, a helpful food-label assistant.
Model requirement: gemini-2.5-flash-lite.

STRICT SCOPE RULES:
- You MUST answer ONLY using the provided scan result context.
- If user asks outside this scanned item, refuse politely and redirect to in-scope topics.
- Never invent facts not present or directly inferable from context.
- Keep tone concise and clean.

Return ONLY valid JSON in this exact shape:
{
  "answer": string,
  "inScope": boolean
}

Context (single scanned item):
${JSON.stringify(compactResultContext(result), null, 2)}

Recent chat (optional):
${recent.length ? recent.join("\n") : "none"}

User question:
${question}
`;

        const generated = await generateGeminiJson<ChatResponseShape>(prompt, undefined, {
            profile: "analyze-agent",
            action: "generate_json",
            goal: "Answer user question strictly from the provided scanned-product result context.",
        });

        const answer = generated.answer?.trim() ||
            `I can only answer about ${result.productName} from this scan (score, claims, ingredients, alerts, and alternatives).`;

        return NextResponse.json({
            answer,
            inScope: Boolean(generated.inScope),
        });
    } catch (error) {
        if (error instanceof GeminiConfigError) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const message = error instanceof Error ? error.message : "Unknown error";
        const normalized = message.toLowerCase();

        if (normalized.includes("429") || normalized.includes("resource_exhausted") || normalized.includes("quota")) {
            return NextResponse.json(
                {
                    error: "AI quota reached for chat right now.",
                    message: "Please retry in a moment.",
                },
                { status: 429 }
            );
        }

        if (normalized.includes("503") || normalized.includes("unavailable") || normalized.includes("high demand")) {
            return NextResponse.json(
                {
                    error: "AI service temporarily unavailable.",
                    message: "Model is under high demand. Please retry in a few seconds.",
                },
                { status: 503 }
            );
        }

        return NextResponse.json(
            {
                error: "Failed to generate chat response.",
                message,
            },
            { status: 500 }
        );
    }
}
