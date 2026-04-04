import { NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";
import type { AnalysisResult } from "@/lib/claim-analysis";
import type { CommunityCommentDoc, CommunityPostDoc, CommunityPostView, CommunityReactionDoc } from "@/lib/community";
import { normalizeAuthorName, toPostDocument, toUserPostDocument } from "@/lib/community";
import { getAuthenticatedUser } from "@/lib/auth-session";

export const runtime = "nodejs";

interface CreatePostBody {
    result?: AnalysisResult;
    productName?: string;
    text?: string;
    mediaUrl?: string;
    mediaPublicId?: string;
}

function toDateISOString(value: Date | string | undefined): string {
    if (!value) {
        return new Date(0).toISOString();
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.valueOf()) ? new Date(0).toISOString() : parsed.toISOString();
}

function serializePost(
    doc: CommunityPostDoc & { _id: NonNullable<CommunityPostDoc["_id"]> },
    comments: CommunityCommentDoc[],
    currentUserReaction: "like" | "dislike" | null
): CommunityPostView {
    return {
        id: doc._id.toHexString(),
        postType: doc.postType || "analysis",
        scanId: doc.scanId,
        productName: doc.productName,
        bodyText: doc.bodyText,
        mediaUrl: doc.mediaUrl,
        claimOMeter: doc.claimOMeter,
        verdict: doc.verdict,
        personalizedSummary: doc.personalizedSummary,
        falseClaims: doc.falseClaims,
        harmfulIngredients: doc.harmfulIngredients,
        labelAlerts: doc.labelAlerts,
        recommendedLabels: doc.recommendedLabels,
        authorName: doc.authorName,
        createdAt: toDateISOString(doc.createdAt),
        updatedAt: toDateISOString(doc.updatedAt),
        reactionCounts: {
            like: doc.reactionCounts?.like ?? 0,
            dislike: doc.reactionCounts?.dislike ?? 0,
        },
        commentCount: doc.commentCount ?? comments.length,
        comments: comments.map((comment) => ({
            id: comment._id?.toHexString() ?? "",
            authorName: comment.authorName,
            text: comment.text,
            createdAt: toDateISOString(comment.createdAt),
        })),
        currentUserReaction,
    };
}

export async function GET(request: Request): Promise<Response> {
    try {
        const url = new URL(request.url);
        const limitParam = Number(url.searchParams.get("limit") || "20");
        const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 20;
        const userKey = (url.searchParams.get("userKey") || "").trim();

        const db = await getMongoDb();
        const postsCollection = db.collection<CommunityPostDoc>("community_posts");
        const commentsCollection = db.collection<CommunityCommentDoc>("community_comments");
        const reactionsCollection = db.collection<CommunityReactionDoc>("community_reactions");

        const postDocs = await postsCollection.find({}).sort({ createdAt: -1 }).limit(limit).toArray();

        if (!postDocs.length) {
            return NextResponse.json({ posts: [] satisfies CommunityPostView[] });
        }

        const postIds = postDocs
            .map((post) => post._id)
            .filter((id): id is NonNullable<CommunityPostDoc["_id"]> => Boolean(id));

        const comments = await commentsCollection
            .find({ postId: { $in: postIds } })
            .sort({ createdAt: 1 })
            .toArray();

        const commentsByPost = new Map<string, CommunityCommentDoc[]>();
        for (const comment of comments) {
            const key = comment.postId.toHexString();
            const existing = commentsByPost.get(key);
            if (existing) {
                existing.push(comment);
            } else {
                commentsByPost.set(key, [comment]);
            }
        }

        const reactionsByPost = new Map<string, "like" | "dislike">();
        if (userKey) {
            const userReactions = await reactionsCollection.find({ postId: { $in: postIds }, userKey }).toArray();
            for (const reaction of userReactions) {
                reactionsByPost.set(reaction.postId.toHexString(), reaction.value === 1 ? "like" : "dislike");
            }
        }

        const posts = postDocs
            .filter((post): post is CommunityPostDoc & { _id: NonNullable<CommunityPostDoc["_id"]> } => Boolean(post._id))
            .map((post) => {
                const key = post._id.toHexString();
                return serializePost(post, commentsByPost.get(key) || [], reactionsByPost.get(key) || null);
            });

        return NextResponse.json({ posts });
    } catch (error) {
        return NextResponse.json(
            {
                error: "Failed to fetch community posts.",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

export async function POST(request: Request): Promise<Response> {
    try {
        const authUser = await getAuthenticatedUser(request);
        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = (await request.json()) as CreatePostBody;
        const result = body.result;

        const isAnalysisPost = Boolean(result?.scanId && result?.productName);
        const isUserPost = Boolean(body.productName?.trim() && body.text?.trim());

        if (!isAnalysisPost && !isUserPost) {
            return NextResponse.json({ error: "Invalid post payload." }, { status: 400 });
        }

        if (isUserPost && !authUser.verified) {
            return NextResponse.json({ error: "Only verified users can create custom posts." }, { status: 403 });
        }

        const db = await getMongoDb();
        const postsCollection = db.collection<CommunityPostDoc>("community_posts");
        const commentsCollection = db.collection<CommunityCommentDoc>("community_comments");

        const authorName = normalizeAuthorName(authUser.fullName || authUser.email.split("@")[0] || "Anonymous Spy");

        const postDoc = isAnalysisPost
            ? toPostDocument(result as AnalysisResult, authorName)
            : toUserPostDocument({
                authorName,
                productName: body.productName?.trim() || "Untitled post",
                bodyText: body.text?.trim() || "",
                mediaUrl: body.mediaUrl?.trim() || undefined,
                mediaPublicId: body.mediaPublicId?.trim() || undefined,
            });

        const insert = await postsCollection.insertOne(postDoc);

        await postsCollection.createIndex({ createdAt: -1 });
        await commentsCollection.createIndex({ postId: 1, createdAt: 1 });

        const created = await postsCollection.findOne({ _id: insert.insertedId });
        if (!created || !created._id) {
            throw new Error("Could not load created post.");
        }

        const serialized = serializePost(created as CommunityPostDoc & { _id: NonNullable<CommunityPostDoc["_id"]> }, [], null);
        return NextResponse.json({ post: serialized }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            {
                error: "Failed to publish community post.",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
