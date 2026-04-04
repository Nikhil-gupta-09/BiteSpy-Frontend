import { NextResponse } from "next/server";
import { clearSessionCookie, deleteSessionByRequest } from "@/lib/auth-session";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
    await deleteSessionByRequest(request);
    await clearSessionCookie();
    return NextResponse.json({ ok: true });
}
