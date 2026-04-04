import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import type { IngredientQuestion, ScanResult } from "@/lib/claim-analysis";
import { generateGeminiJson, GeminiConfigError } from "@/lib/gemini";
import { getScan, saveScan } from "@/lib/scan-store";

export const runtime = "nodejs";

interface ScanRequestBody {
    imageDataUrl?: string;
    productName?: string;
    cloudinaryUrl?: string;
    cloudinaryPublicId?: string;
}

interface GeminiScanShape {
    productName?: string;
    brand?: string;
    category?: string;
    ingredients?: string[];
    detectedLabels?: string[];
    marketingClaims?: string[];
    allergySignals?: string[];
    healthConcerns?: string[];
    questions?: Array<{ text?: string; focus?: "health" | "allergy" | "preference" }>;
}

function parseDataUrl(imageDataUrl: string): { mimeType: string; data: string } {
    const match = imageDataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

    if (!match?.[1] || !match[2]) {
        throw new Error("Invalid image format. Please upload PNG, JPEG, or WEBP image data.");
    }

    return {
        mimeType: match[1],
        data: match[2],
    };
}

function normalizeQuestions(questions?: GeminiScanShape["questions"]): IngredientQuestion[] {
    if (!questions?.length) {
        return [
            { id: "q1", text: "Do you avoid added sugars for blood-glucose control?", focus: "health" },
            { id: "q2", text: "Do you need this product to be nut-free?", focus: "allergy" },
            { id: "q3", text: "Do you prefer palm-oil-free options?", focus: "preference" },
            { id: "q4", text: "Are artificial flavors or colors a concern for you?", focus: "health" },
            { id: "q5", text: "Do you want higher protein or fiber in this category?", focus: "preference" },
        ];
    }

    return questions.slice(0, 6).map((q, index) => ({
        id: `q${index + 1}`,
        text: q.text?.trim() || `Question ${index + 1}`,
        focus: q.focus ?? "preference",
    }));
}

export async function POST(request: Request): Promise<Response> {
    try {
        const body = (await request.json()) as ScanRequestBody;
        const hasImage = Boolean(body.imageDataUrl);
        const typedProductName = body.productName?.trim();

        if (!hasImage && !typedProductName) {
            return NextResponse.json({ error: "Provide either imageDataUrl or productName in request body." }, { status: 400 });
        }

        const prompt = hasImage
            ? `
You are a strict food-label analysis assistant.
Analyze the product image and respond ONLY as valid JSON.

Required JSON shape:
{
  "productName": string,
  "brand": string,
  "category": string,
  "ingredients": string[],
  "detectedLabels": string[],
  "marketingClaims": string[],
  "allergySignals": string[],
  "healthConcerns": string[],
  "questions": [
    { "text": string, "focus": "health" | "allergy" | "preference" }
  ]
}

Rules:
- Infer likely ingredients if not fully visible, but keep conservative wording.
- Questions must be practical and tied to ingredients, health, allergies, or preference.
- Create 5 to 6 questions.
- Avoid medical diagnosis claims.
`
            : `
You are a strict food-product analysis assistant.
User provided only a product name. Infer likely product details conservatively and respond ONLY as valid JSON.

Product name: ${typedProductName}

Required JSON shape:
{
    "productName": string,
    "brand": string,
    "category": string,
    "ingredients": string[],
    "detectedLabels": string[],
    "marketingClaims": string[],
    "allergySignals": string[],
    "healthConcerns": string[],
    "questions": [
        { "text": string, "focus": "health" | "allergy" | "preference" }
    ]
}

Rules:
- If unsure, provide likely/common ingredients for that product type.
- Questions must still be practical and tied to ingredients, health, allergies, or preference.
- Create 5 to 6 questions.
- Avoid medical diagnosis claims.
`;

        const inlineData = hasImage ? parseDataUrl(body.imageDataUrl as string) : undefined;
        const gemini = await generateGeminiJson<GeminiScanShape>(prompt, inlineData, {
            profile: "scan-agent",
            action: "scan_product",
            goal: "Detect product and create ingredient-focused health/allergy/preference questions.",
        });
        const scanId = randomUUID();

        const normalized: ScanResult = {
            scanId,
            productName: gemini.productName?.trim() || "Unknown product",
            brand: gemini.brand?.trim() || "Unknown brand",
            category: gemini.category?.trim() || "Packaged food",
            cloudinaryUrl: body.cloudinaryUrl?.trim() || undefined,
            cloudinaryPublicId: body.cloudinaryPublicId?.trim() || undefined,
            ingredients: (gemini.ingredients ?? []).slice(0, 20),
            detectedLabels: (gemini.detectedLabels ?? []).slice(0, 12),
            marketingClaims: (gemini.marketingClaims ?? []).slice(0, 10),
            allergySignals: (gemini.allergySignals ?? []).slice(0, 10),
            healthConcerns: (gemini.healthConcerns ?? []).slice(0, 10),
            questions: normalizeQuestions(gemini.questions),
        };

        saveScan(normalized);
        return NextResponse.json(normalized);
    } catch (error) {
        if (error instanceof GeminiConfigError) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const rawMessage = error instanceof Error ? error.message : "Unknown error";
        const normalizedMessage = rawMessage.toLowerCase();

        if (
            normalizedMessage.includes("resource_exhausted") ||
            normalizedMessage.includes("quota") ||
            normalizedMessage.includes("429")
        ) {
            return NextResponse.json(
                {
                    error: "AI quota reached for image analysis.",
                    message:
                        "The MCP Gemini key has hit rate/quota limits. Try again in a few minutes or switch MCP GEMINI_API_KEY to a billed/available project.",
                },
                { status: 429 }
            );
        }

        if (
            normalizedMessage.includes("503") ||
            normalizedMessage.includes("unavailable") ||
            normalizedMessage.includes("high demand")
        ) {
            return NextResponse.json(
                {
                    error: "AI service temporarily unavailable.",
                    message: "Model is under high demand right now. Please retry in a few seconds.",
                },
                { status: 503 }
            );
        }

        if (normalizedMessage.includes("request entity too large") || normalizedMessage.includes("payload too large")) {
            return NextResponse.json(
                {
                    error: "Uploaded image is too large.",
                    message: "Please upload a smaller image (compressed PNG/JPEG/WEBP).",
                },
                { status: 413 }
            );
        }

        return NextResponse.json(
            {
                error: "Failed to analyze product image.",
                message: rawMessage,
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

    const scan = getScan(scanId);
    if (!scan) {
        return NextResponse.json({ error: "Scan not found or expired." }, { status: 404 });
    }

    return NextResponse.json(scan);
}
