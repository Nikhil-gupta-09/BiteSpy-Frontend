import { NextRequest } from "next/server";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase-admin";
import { normalizeEmail, parseProfilePayload } from "@/lib/profile";

export const runtime = "nodejs";

function json(body: unknown, status = 200) {
    return Response.json(body, { status });
}

function serializeDocument(snapshot: { data(): Record<string, unknown> | undefined }) {
    const data = snapshot.data();

    if (!data) {
        return null;
    }

    const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : undefined;
    const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : undefined;

    return {
        fullName: data.fullName ?? "",
        age: Number(data.age ?? 0),
        gender: data.gender ?? "",
        height: Number(data.height ?? 0),
        weight: Number(data.weight ?? 0),
        conditions: Array.isArray(data.conditions) ? data.conditions : [],
        diet: data.diet ?? "",
        goal: data.goal ?? "",
        email: data.email ?? "",
        createdAt,
        updatedAt,
    };
}

function getUserRef(emailInput: string) {
    const email = normalizeEmail(emailInput);
    return adminDb.collection("users").doc(email);
}

export async function GET(request: NextRequest) {
    try {
        const email = request.nextUrl.searchParams.get("email");

        if (!email) {
            return json({ error: "Email is required" }, 400);
        }

        const snapshot = await getUserRef(email).get();

        if (!snapshot.exists) {
            return json({ error: "Profile not found" }, 404);
        }

        return json({ profile: serializeDocument(snapshot) });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch profile";
        return json({ error: message }, 500);
    }
}

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json();
        const { email, profile, errors } = parseProfilePayload(payload);

        if (errors.length > 0) {
            return json({ error: errors[0], errors }, 400);
        }

        const userRef = getUserRef(email);
        const snapshot = await userRef.get();

        await userRef.set(
            {
                ...profile,
                email,
                createdAt: snapshot.exists ? snapshot.data()?.createdAt ?? FieldValue.serverTimestamp() : FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
            },
            { merge: true }
        );

        const saved = await userRef.get();
        return json({ profile: serializeDocument(saved) }, snapshot.exists ? 200 : 201);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to save profile";
        return json({ error: message }, 500);
    }
}

export async function PUT(request: NextRequest) {
    try {
        const payload = await request.json();
        const { email, profile, errors } = parseProfilePayload(payload);

        if (errors.length > 0) {
            return json({ error: errors[0], errors }, 400);
        }

        const userRef = getUserRef(email);
        const snapshot = await userRef.get();

        if (!snapshot.exists) {
            return json({ error: "Profile not found" }, 404);
        }

        await userRef.set(
            {
                ...profile,
                email,
                createdAt: snapshot.data()?.createdAt ?? FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
            },
            { merge: true }
        );

        const saved = await userRef.get();
        return json({ profile: serializeDocument(saved) });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update profile";
        return json({ error: message }, 500);
    }
}