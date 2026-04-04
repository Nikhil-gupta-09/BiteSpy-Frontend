const GEMINI_MODEL = "gemini-2.5-flash-lite";

interface GenerateContentPart {
    text?: string;
}

interface GenerateContentCandidate {
    content?: {
        parts?: GenerateContentPart[];
    };
}

interface GenerateContentResponse {
    candidates?: GenerateContentCandidate[];
}

export class GeminiConfigError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "GeminiConfigError";
    }
}

function extractJsonPayload(raw: string): string {
    const fenced = raw.match(/```json\s*([\s\S]*?)```/i);
    if (fenced?.[1]) {
        return fenced[1].trim();
    }

    const firstBrace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");

    if (firstBrace >= 0 && lastBrace > firstBrace) {
        return raw.slice(firstBrace, lastBrace + 1);
    }

    throw new Error("Gemini response did not include valid JSON.");
}

export async function generateGeminiJson<T>(
    prompt: string,
    inlineData?: { mimeType: string; data: string }
): Promise<T> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new GeminiConfigError("Missing GEMINI_API_KEY environment variable.");
    }

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: inlineData
                            ? [
                                { text: prompt },
                                {
                                    inlineData: {
                                        mimeType: inlineData.mimeType,
                                        data: inlineData.data,
                                    },
                                },
                            ]
                            : [{ text: prompt }],
                    },
                ],
                generationConfig: {
                    temperature: 0.2,
                    responseMimeType: "application/json",
                },
            }),
        }
    );

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Gemini request failed (${response.status}): ${body}`);
    }

    const payload = (await response.json()) as GenerateContentResponse;
    const rawText = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("\n").trim();

    if (!rawText) {
        throw new Error("Gemini returned an empty response.");
    }

    const json = extractJsonPayload(rawText);
    return JSON.parse(json) as T;
}
