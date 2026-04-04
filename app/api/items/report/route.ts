import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";
import type { ItemDoc } from "@/lib/items";

export const runtime = "nodejs";

interface ReportBody {
    itemId?: string;
}

export async function POST(request: Request): Promise<Response> {
    try {
        const body = (await request.json()) as ReportBody;
        const itemId = body.itemId?.trim() || "";

        if (!itemId || !ObjectId.isValid(itemId)) {
            return NextResponse.json({ error: "Valid itemId is required." }, { status: 400 });
        }

        const db = await getMongoDb();
        const items = db.collection<ItemDoc>("items");
        const _id = new ObjectId(itemId);

        const current = await items.findOne({ _id });
        if (!current) {
            return NextResponse.json({ error: "Item not found." }, { status: 404 });
        }

        const nextReports = (current.verifiedReports || 0) + 1;
        const nextFlag = nextReports > 5;

        await items.updateOne(
            { _id },
            {
                $set: {
                    verifiedReports: nextReports,
                    flagged: nextFlag,
                    updatedAt: new Date(),
                },
            }
        );

        return NextResponse.json({
            ok: true,
            itemId,
            verifiedReports: nextReports,
            flagged: nextFlag,
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: "Failed to report item.",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
