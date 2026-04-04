import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-session";

export const runtime = "nodejs";

export async function GET(request: Request): Promise<Response> {
    const user = await getAuthenticatedUser(request);
    if (!user) {
        return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
        user: {
            email: user.email,
            fullName: user.fullName || "",
            verified: Boolean(user.verified),
        },
    });
}
