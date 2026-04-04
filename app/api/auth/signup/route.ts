import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";
import { normalizeEmail } from "@/lib/profile";
import { hashPassword, issueSession, setSessionCookie, type AuthUserDoc } from "@/lib/auth-session";

export const runtime = "nodejs";

interface SignupBody {
    email?: string;
    password?: string;
    mode?: "email" | "phone";
}

export async function POST(request: Request): Promise<Response> {
    try {
        const body = (await request.json()) as SignupBody;
        const email = normalizeEmail(body.email || "");
        const password = body.password?.trim() || "";
        const mode = body.mode === "phone" ? "phone" : "email";

        if (!email) {
            return NextResponse.json({ error: "Email is required." }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
        }

        const db = await getMongoDb();
        const users = db.collection<AuthUserDoc>("auth_users");

        await users.createIndex({ email: 1 }, { unique: true });
        await users.createIndex({ uid: 1 }, { unique: true });

        const existing = await users.findOne({ email });
        if (existing) {
            return NextResponse.json({ error: "Account already exists for this email." }, { status: 409 });
        }

        const now = new Date();
        await users.insertOne({
            uid: randomUUID(),
            email,
            passwordHash: await hashPassword(password),
            mode,
            provider: "mongodb",
            verified: false,
            fullName: "",
            conditions: [],
            createdAt: now,
            updatedAt: now,
            lastLoginAt: now,
        });

        const token = await issueSession(email);
        await setSessionCookie(token);

        return NextResponse.json({ ok: true, email, verified: false }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            {
                error: "Failed to sign up.",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
