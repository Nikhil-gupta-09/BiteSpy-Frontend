import { randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { cookies } from "next/headers";
import type { Db } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";

const scrypt = promisify(nodeScrypt);
const SESSION_COOKIE = "bitespy_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14;

export interface AuthUserDoc {
    _id?: unknown;
    uid: string;
    email: string;
    passwordHash: string;
    mode: "email" | "phone";
    provider: "mongodb";
    verified: boolean;
    fullName?: string;
    age?: number;
    gender?: string;
    height?: number;
    weight?: number;
    conditions?: string[];
    diet?: string;
    goal?: string;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt?: Date;
}

interface AuthSessionDoc {
    token: string;
    email: string;
    expiresAt: Date;
    createdAt: Date;
}

function splitHash(encoded: string): { salt: Buffer; hash: Buffer } {
    const [saltHex, hashHex] = encoded.split(":");
    if (!saltHex || !hashHex) {
        throw new Error("Invalid password hash format.");
    }

    return {
        salt: Buffer.from(saltHex, "hex"),
        hash: Buffer.from(hashHex, "hex"),
    };
}

export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16);
    const derived = (await scrypt(password, salt, 64)) as Buffer;
    return `${salt.toString("hex")}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const { salt, hash } = splitHash(storedHash);
    const derived = (await scrypt(password, salt, hash.length)) as Buffer;
    return timingSafeEqual(hash, derived);
}

async function getCollections(db?: Db) {
    const resolved = db ?? (await getMongoDb());
    return {
        db: resolved,
        users: resolved.collection<AuthUserDoc>("auth_users"),
        sessions: resolved.collection<AuthSessionDoc>("auth_sessions"),
    };
}

export async function issueSession(email: string): Promise<string> {
    const { sessions } = await getCollections();
    const token = randomBytes(32).toString("hex");
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);

    await sessions.createIndex({ token: 1 }, { unique: true });
    await sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

    await sessions.insertOne({
        token,
        email,
        createdAt: now,
        expiresAt,
    });

    return token;
}

export async function setSessionCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_TTL_MS / 1000,
    });
}

export async function clearSessionCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
}

export async function getAuthenticatedUser(request: Request): Promise<AuthUserDoc | null> {
    const cookieHeader = request.headers.get("cookie") || "";
    const tokenPart = cookieHeader
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${SESSION_COOKIE}=`));

    if (!tokenPart) {
        return null;
    }

    const token = tokenPart.slice(`${SESSION_COOKIE}=`.length);
    if (!token) {
        return null;
    }

    const { sessions, users } = await getCollections();
    const session = await sessions.findOne({ token });
    if (!session || session.expiresAt.getTime() < Date.now()) {
        return null;
    }

    const user = await users.findOne({ email: session.email });
    return user ?? null;
}

export async function deleteSessionByRequest(request: Request): Promise<void> {
    const cookieHeader = request.headers.get("cookie") || "";
    const tokenPart = cookieHeader
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${SESSION_COOKIE}=`));

    if (!tokenPart) {
        return;
    }

    const token = tokenPart.slice(`${SESSION_COOKIE}=`.length);
    if (!token) {
        return;
    }

    const { sessions } = await getCollections();
    await sessions.deleteOne({ token });
}
