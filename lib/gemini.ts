const GEMINI_MODEL = "gemini-2.5-flash-lite";

import { ArmorIQClient } from "@armoriq/sdk";
import { getAgentPolicyConfig, type ArmorIQAgentProfile } from "@/lib/armoriq-policy";

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

interface ArmorIQInvokeResponse {
    result?: unknown;
    content?: Array<{ text?: string }>;
}

interface GenerateGeminiOptions {
    profile?: ArmorIQAgentProfile;
    action?: string;
    goal?: string;
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

function extractTextFromUnknownPayload(payload: unknown): string {
    if (!payload) {
        return "";
    }

    if (typeof payload === "string") {
        return payload;
    }

    if (Array.isArray(payload)) {
        return payload
            .map((item) => {
                if (typeof item === "string") {
                    return item;
                }

                if (item && typeof item === "object" && "text" in item) {
                    return String((item as { text?: unknown }).text ?? "");
                }

                return JSON.stringify(item);
            })
            .join("\n")
            .trim();
    }

    if (payload && typeof payload === "object") {
        const maybe = payload as { text?: unknown; content?: unknown; result?: unknown };

        if (typeof maybe.text === "string") {
            return maybe.text;
        }

        if (maybe.content) {
            return extractTextFromUnknownPayload(maybe.content);
        }

        if (maybe.result) {
            return extractTextFromUnknownPayload(maybe.result);
        }

        return JSON.stringify(payload);
    }

    return String(payload);
}

function isArmorIQEnabled(): boolean {
    return Boolean(process.env.ARMORIQ_API_KEY && process.env.ARMORIQ_MCP_SERVER_NAME);
}

function createArmorIQClient(profile: ArmorIQAgentProfile): ArmorIQClient {
    const apiKey = process.env.ARMORIQ_API_KEY;
    const userId = process.env.ARMORIQ_USER_ID || process.env.USER_ID;
    const baseAgentId = process.env.ARMORIQ_AGENT_ID || process.env.AGENT_ID;

    if (!apiKey || !userId || !baseAgentId) {
        throw new GeminiConfigError(
            "Missing ArmorIQ env vars. Required: ARMORIQ_API_KEY, ARMORIQ_USER_ID (or USER_ID), ARMORIQ_AGENT_ID (or AGENT_ID)."
        );
    }

    return new ArmorIQClient({
        apiKey,
        userId,
        agentId: `${baseAgentId}:${profile}`,
        proxyEndpoint: process.env.ARMORIQ_PROXY_ENDPOINT || process.env.PROXY_ENDPOINT,
    });
}

async function generateViaArmorIQ<T>(
    prompt: string,
    inlineData: { mimeType: string; data: string } | undefined,
    options: GenerateGeminiOptions
): Promise<T> {
    const mcpServer = process.env.ARMORIQ_MCP_SERVER_NAME;
    if (!mcpServer) {
        throw new GeminiConfigError("Missing ARMORIQ_MCP_SERVER_NAME environment variable.");
    }

    const profile = options.profile ?? "scan-agent";
    const client = createArmorIQClient(profile);
    const policyConfig = getAgentPolicyConfig(mcpServer, profile);
    const action = options.action || policyConfig.action;
    const goal = options.goal || policyConfig.goal;

    const plan = {
        goal,
        steps: [
            {
                action,
                mcp: mcpServer,
                params: {
                    model: GEMINI_MODEL,
                    responseMimeType: "application/json",
                },
            },
        ],
    };

    const captured = client.capturePlan(GEMINI_MODEL, prompt, plan, {
        profile,
        source: "bitespy-backend",
    });

    const token = await client.getIntentToken(captured, policyConfig.policy, 180);
    const invokeResult = (await client.invoke(mcpServer, action, token, {
        model: GEMINI_MODEL,
        prompt,
        inlineData,
        generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
        },
    })) as ArmorIQInvokeResponse;

    const rawText = extractTextFromUnknownPayload(invokeResult.result ?? invokeResult.content).trim();
    if (!rawText) {
        throw new Error("ArmorIQ MCP invocation returned empty content.");
    }

    const json = extractJsonPayload(rawText);
    return JSON.parse(json) as T;
}

export async function generateGeminiJson<T>(
    prompt: string,
    inlineData?: { mimeType: string; data: string },
    options: GenerateGeminiOptions = {}
): Promise<T> {
    if (isArmorIQEnabled()) {
        try {
            return await generateViaArmorIQ<T>(prompt, inlineData, options);
        } catch (error) {
            if (process.env.ARMORIQ_STRICT_MODE === "true") {
                throw error;
            }
        }
    }

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
