import { NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";
import { normalizeEmail } from "@/lib/profile";
import { verifyPassword, issueSession, setSessionCookie, type AuthUserDoc } from "@/lib/auth-session";

export const runtime = "nodejs";

interface LoginBody {
    email?: string;
    password?: string;
}

export async function POST(request: Request): Promise<Response> {
    try {
        const body = (await request.json()) as LoginBody;
        const email = normalizeEmail(body.email || "");
        const password = body.password || "";

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
        }

        const db = await getMongoDb();
        const users = db.collection<AuthUserDoc>("auth_users");
        const user = await users.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
        }

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) {
            return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
        }

        await users.updateOne({ email }, { $set: { lastLoginAt: new Date(), updatedAt: new Date() } });
        const token = await issueSession(email);
        await setSessionCookie(token);

        return NextResponse.json({
            ok: true,
            user: {
                email: user.email,
                fullName: user.fullName || "",
                verified: Boolean(user.verified),
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: "Failed to login.",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
