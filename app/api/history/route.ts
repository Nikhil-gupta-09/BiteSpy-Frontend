import { NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";
import type { AnalysisResult } from "@/lib/claim-analysis";
import type { UserSearchHistoryDoc, UserSearchHistoryListItem } from "@/lib/history";
import { normalizeEmail } from "@/lib/profile";

export const runtime = "nodejs";

interface SaveHistoryBody {
    email?: string;
    source?: "image" | "name" | "unknown";
    result?: AnalysisResult;
}

function toIso(value: Date | string | undefined): string {
    if (!value) {
        return new Date(0).toISOString();
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.valueOf()) ? new Date(0).toISOString() : parsed.toISOString();
}

export async function GET(request: Request): Promise<Response> {
    try {
        const url = new URL(request.url);
        const email = normalizeEmail(url.searchParams.get("email") || "");
        const limitParam = Number(url.searchParams.get("limit") || "20");
        const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 20;

        if (!email) {
            return NextResponse.json({ error: "Email is required." }, { status: 400 });
        }

        const db = await getMongoDb();
        const collection = db.collection<UserSearchHistoryDoc>("user_search_history");

        const docs = await collection.find({ email }).sort({ createdAt: -1 }).limit(limit).toArray();
        const history: UserSearchHistoryListItem[] = docs
            .filter((doc): doc is UserSearchHistoryDoc & { _id: NonNullable<UserSearchHistoryDoc["_id"]> } => Boolean(doc._id))
            .map((doc) => ({
                id: doc._id.toHexString(),
                scanId: doc.scanId,
                productName: doc.productName,
                claimOMeter: doc.claimOMeter,
                verdict: doc.verdict,
                source: doc.source,
                createdAt: toIso(doc.createdAt),
            }));

        return NextResponse.json({ history });
    } catch (error) {
        return NextResponse.json(
            {
                error: "Failed to load history.",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

export async function POST(request: Request): Promise<Response> {
    try {
        const body = (await request.json()) as SaveHistoryBody;
        const email = normalizeEmail(body.email || "");
        const result = body.result;
        const source = body.source || "unknown";

        if (!email) {
            return NextResponse.json({ error: "Email is required." }, { status: 400 });
        }

        if (!result || !result.scanId || !result.productName) {
            return NextResponse.json({ error: "Valid analysis result payload is required." }, { status: 400 });
        }

        const db = await getMongoDb();
        const collection = db.collection<UserSearchHistoryDoc>("user_search_history");

        await collection.createIndex({ email: 1, createdAt: -1 });
        await collection.createIndex({ email: 1, scanId: 1 }, { unique: true });

        const now = new Date();

        await collection.updateOne(
            { email, scanId: result.scanId },
            {
                $set: {
                    email,
                    scanId: result.scanId,
                    productName: result.productName,
                    claimOMeter: result.claimOMeter,
                    verdict: result.verdict,
                    source,
                    result,
                    updatedAt: now,
                },
                $setOnInsert: {
                    createdAt: now,
                },
            },
            { upsert: true }
        );

        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json(
            {
                error: "Failed to save history.",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
