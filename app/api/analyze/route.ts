import { NextResponse } from "next/server";
import type { AnalysisResult, UserAnswer } from "@/lib/claim-analysis";
import { generateGeminiJson, GeminiConfigError } from "@/lib/gemini";
import { getAnalysis, getScan, saveAnalysis } from "@/lib/scan-store";

export const runtime = "nodejs";

interface AnalyzeRequestBody {
    scanId?: string;
    answers?: UserAnswer[];
}

interface GeminiAnalysisShape {
    claimOMeter?: number;
    verdict?: string;
    personalizedSummary?: string;
    falseClaims?: string[];
    harmfulIngredients?: Array<{ name?: string; risk?: string; whyItMatters?: string }>;
    labelAlerts?: string[];
    goodPoints?: string[];
    recommendedLabels?: string[];
    alternatives?: Array<{
        name?: string;
        reason?: string;
        fit?: "healthier" | "allergy-safe" | "preference-match" | "budget";
        priceTier?: "low" | "medium" | "high";
    }>;
}

function clampScore(value: number): number {
    if (Number.isNaN(value)) {
        return 5;
    }

    return Math.max(0, Math.min(10, Number(value.toFixed(1))));
}

export async function POST(request: Request): Promise<Response> {
    try {
        const body = (await request.json()) as AnalyzeRequestBody;
        const scanId = body.scanId?.trim();

        if (!scanId) {
            return NextResponse.json({ error: "Missing scanId in request body." }, { status: 400 });
        }

        const scan = getScan(scanId);
        if (!scan) {
            return NextResponse.json({ error: "Scan not found or expired." }, { status: 404 });
        }

        const answers = (body.answers ?? []).slice(0, 8);

        const prompt = `
You are a food-claim auditor.
Given product scan metadata and user preference answers, generate a strict consumer-safe analysis.
Return ONLY valid JSON in this exact shape:
{
  "claimOMeter": number,
  "verdict": string,
  "personalizedSummary": string,
  "falseClaims": string[],
  "harmfulIngredients": [
    { "name": string, "risk": string, "whyItMatters": string }
  ],
  "labelAlerts": string[],
  "goodPoints": string[],
  "recommendedLabels": string[],
  "alternatives": [
    { "name": string, "reason": string, "fit": "healthier" | "allergy-safe" | "preference-match" | "budget", "priceTier": "low" | "medium" | "high" }
  ]
}

Scoring rules:
- claimOMeter is from 0 (very misleading) to 10 (highly trustworthy)
- Penalize mismatch between claims and ingredient dominance.
- Penalize high-risk allergens and highly processed harmful ingredients.
- Personalize based on user answers.

Product scan JSON:
${JSON.stringify(scan, null, 2)}

User answers JSON:
${JSON.stringify(answers, null, 2)}
`;

        const gemini = await generateGeminiJson<GeminiAnalysisShape>(prompt);

        const result: AnalysisResult = {
            scanId,
            productName: scan.productName,
            claimOMeter: clampScore(gemini.claimOMeter ?? 5),
            verdict: gemini.verdict?.trim() || "Mixed reliability claims.",
            personalizedSummary:
                gemini.personalizedSummary?.trim() ||
                "This product has mixed nutritional signals. Check ingredients and labels before relying on marketing claims.",
            falseClaims: (gemini.falseClaims ?? []).slice(0, 6),
            harmfulIngredients: (gemini.harmfulIngredients ?? []).slice(0, 6).map((item) => ({
                name: item.name?.trim() || "Unspecified ingredient",
                risk: item.risk?.trim() || "Potential concern",
                whyItMatters: item.whyItMatters?.trim() || "Review with your dietary needs.",
            })),
            labelAlerts: (gemini.labelAlerts ?? []).slice(0, 8),
            goodPoints: (gemini.goodPoints ?? []).slice(0, 6),
            recommendedLabels: (gemini.recommendedLabels ?? []).slice(0, 8),
            ingredients: scan.ingredients,
            alternatives: (gemini.alternatives ?? []).slice(0, 6).map((item) => ({
                name: item.name?.trim() || "Alternative option",
                reason: item.reason?.trim() || "Better fit for your selected goals.",
                fit: item.fit ?? "healthier",
                priceTier: item.priceTier ?? "medium",
            })),
        };

        saveAnalysis(result);
        return NextResponse.json(result);
    } catch (error) {
        if (error instanceof GeminiConfigError) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(
            {
                error: "Failed to generate product analysis.",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const scanId = url.searchParams.get("scanId");

    if (!scanId) {
        return NextResponse.json({ error: "Missing scanId query parameter." }, { status: 400 });
    }

    const analysis = getAnalysis(scanId);
    if (!analysis) {
        return NextResponse.json({ error: "Analysis not found or expired." }, { status: 404 });
    }

    return NextResponse.json(analysis);
}
