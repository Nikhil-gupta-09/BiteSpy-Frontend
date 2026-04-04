import { NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";
import type { CommunityCommentDoc, CommunityPostDoc } from "@/lib/community";
import { normalizeAuthorName, toObjectId } from "@/lib/community";
import { getAuthenticatedUser } from "@/lib/auth-session";

export const runtime = "nodejs";

interface CommentBody {
    text?: string;
}

export async function GET(
    request: Request,
    context: { params: Promise<{ postId: string }> }
): Promise<Response> {
    try {
        const { postId: postIdParam } = await context.params;
        const postId = toObjectId(postIdParam);
        const url = new URL(request.url);
        const limitParam = Number(url.searchParams.get("limit") || "50");
        const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 50;

        const db = await getMongoDb();
        const commentsCollection = db.collection<CommunityCommentDoc>("community_comments");
        const comments = await commentsCollection.find({ postId }).sort({ createdAt: 1 }).limit(limit).toArray();

        return NextResponse.json({
            comments: comments.map((comment) => ({
                id: comment._id?.toHexString() ?? "",
                authorName: comment.authorName,
                text: comment.text,
                createdAt: comment.createdAt.toISOString(),
            })),
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: "Failed to fetch comments.",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

export async function POST(
    request: Request,
    context: { params: Promise<{ postId: string }> }
): Promise<Response> {
    try {
        const authUser = await getAuthenticatedUser(request);
        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { postId: postIdParam } = await context.params;
        const postId = toObjectId(postIdParam);
        const body = (await request.json()) as CommentBody;
        const authorName = normalizeAuthorName(authUser.fullName || authUser.email.split("@")[0] || "Anonymous Spy");
        const text = typeof body.text === "string" ? body.text.trim() : "";

        if (!text) {
            return NextResponse.json({ error: "Comment text cannot be empty." }, { status: 400 });
        }

        if (text.length > 400) {
            return NextResponse.json({ error: "Comment is too long. Maximum 400 characters." }, { status: 400 });
        }

        const db = await getMongoDb();
        const postsCollection = db.collection<CommunityPostDoc>("community_posts");
        const commentsCollection = db.collection<CommunityCommentDoc>("community_comments");

        const post = await postsCollection.findOne({ _id: postId });
        if (!post) {
            return NextResponse.json({ error: "Post not found." }, { status: 404 });
        }

        const insert = await commentsCollection.insertOne({
            postId,
            authorName,
            text,
            createdAt: new Date(),
        });

        await postsCollection.updateOne(
            { _id: postId },
            {
                $inc: { commentCount: 1 },
                $set: { updatedAt: new Date() },
            }
        );

        return NextResponse.json(
            {
                comment: {
                    id: insert.insertedId.toHexString(),
                    authorName,
                    text,
                    createdAt: new Date().toISOString(),
                },
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                error: "Failed to add comment.",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
