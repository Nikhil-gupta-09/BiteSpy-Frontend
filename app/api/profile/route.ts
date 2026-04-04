import { NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";
import { getAuthenticatedUser, type AuthUserDoc } from "@/lib/auth-session";

export const runtime = "nodejs";

interface ProfilePayload {
    fullName?: string;
    age?: number;
    gender?: string;
    height?: number;
    weight?: number;
    conditions?: string[];
    diet?: string;
    goal?: string;
}

function toProfileView(user: AuthUserDoc) {
    return {
        fullName: user.fullName || "",
        age: Number(user.age || 0),
        gender: user.gender || "",
        height: Number(user.height || 0),
        weight: Number(user.weight || 0),
        conditions: Array.isArray(user.conditions) ? user.conditions : [],
        diet: user.diet || "",
        goal: user.goal || "",
        email: user.email,
        verified: Boolean(user.verified),
        createdAt: user.createdAt?.toISOString?.() || undefined,
        updatedAt: user.updatedAt?.toISOString?.() || undefined,
    };
}

function validateProfile(input: ProfilePayload): string[] {
    const errors: string[] = [];

    if (!input.fullName?.trim()) {
        errors.push("Full name is required");
    }

    if (!Number.isFinite(input.age) || Number(input.age) <= 0) {
        errors.push("Age must be a valid number");
    }

    if (!input.gender?.trim()) {
        errors.push("Gender is required");
    }

    if (!Number.isFinite(input.height) || Number(input.height) <= 0) {
        errors.push("Height must be a valid number");
    }

    if (!Number.isFinite(input.weight) || Number(input.weight) <= 0) {
        errors.push("Weight must be a valid number");
    }

    if (!input.diet?.trim()) {
        errors.push("Diet is required");
    }

    if (!input.goal?.trim()) {
        errors.push("Goal is required");
    }

    return errors;
}

export async function GET(request: Request): Promise<Response> {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ profile: toProfileView(authUser) });
}

export async function POST(request: Request): Promise<Response> {
    return PUT(request);
}

export async function PUT(request: Request): Promise<Response> {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = (await request.json()) as ProfilePayload;
    const errors = validateProfile(payload);
    if (errors.length) {
        return NextResponse.json({ error: errors[0], errors }, { status: 400 });
    }

    const db = await getMongoDb();
    const users = db.collection<AuthUserDoc>("auth_users");

    const update = {
        fullName: payload.fullName?.trim() || "",
        age: Number(payload.age),
        gender: payload.gender?.trim() || "",
        height: Number(payload.height),
        weight: Number(payload.weight),
        conditions: Array.isArray(payload.conditions)
            ? payload.conditions.map((item) => String(item).trim()).filter(Boolean)
            : [],
        diet: payload.diet?.trim() || "",
        goal: payload.goal?.trim() || "",
        updatedAt: new Date(),
    };

    await users.updateOne({ email: authUser.email }, { $set: update });
    const updated = await users.findOne({ email: authUser.email });
    if (!updated) {
        return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    return NextResponse.json({ profile: toProfileView(updated) });
}
