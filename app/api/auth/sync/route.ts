import { NextRequest } from "next/server";

import { getMongoDb } from "@/lib/mongodb";
import { normalizeEmail } from "@/lib/profile";

export const runtime = "nodejs";

type AuthSyncPayload = {
    email?: string;
    uid?: string;
    mode?: "email" | "phone";
};

function json(body: unknown, status = 200) {
    return Response.json(body, { status });
}

export async function POST(request: NextRequest) {
    try {
        const payload = (await request.json()) as AuthSyncPayload;

        const rawEmail = typeof payload.email === "string" ? payload.email : "";
        const email = normalizeEmail(rawEmail);

        if (!email) {
            return json({ error: "Email is required" }, 400);
        }

        const uid = typeof payload.uid === "string" ? payload.uid.trim() : "";
        if (!uid) {
            return json({ error: "UID is required" }, 400);
        }

        const mode = payload.mode === "phone" ? "phone" : "email";

        const db = await getMongoDb();
        const collection = db.collection("auth_users");

        await collection.createIndex({ email: 1 }, { unique: true });
        await collection.createIndex({ uid: 1 }, { unique: true });

        const now = new Date();

        await collection.updateOne(
            { email },
            {
                $set: {
                    email,
                    uid,
                    mode,
                    provider: "firebase",
                    lastLoginAt: now,
                    updatedAt: now,
                },
                $unset: {
                    firstName: "",
                    lastName: "",
                },
                $setOnInsert: {
                    createdAt: now,
                },
            },
            { upsert: true }
        );

        return json({ ok: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to sync auth user";
        return json({ error: message }, 500);
    }
}
