import { NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";
import type { UserSearchHistoryDoc } from "@/lib/history";
import { toHistoryObjectId } from "@/lib/history";

export const runtime = "nodejs";

export async function GET(
    _request: Request,
    context: { params: Promise<{ historyId: string }> }
): Promise<Response> {
    try {
        const { historyId } = await context.params;
        const db = await getMongoDb();
        const collection = db.collection<UserSearchHistoryDoc>("user_search_history");

        const doc = await collection.findOne({ _id: toHistoryObjectId(historyId) });
        if (!doc) {
            return NextResponse.json({ error: "History entry not found." }, { status: 404 });
        }

        return NextResponse.json({
            history: {
                id: doc._id?.toHexString() || historyId,
                email: doc.email,
                scanId: doc.scanId,
                productName: doc.productName,
                claimOMeter: doc.claimOMeter,
                verdict: doc.verdict,
                source: doc.source,
                createdAt: doc.createdAt.toISOString(),
                result: doc.result,
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: "Failed to load history entry.",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
