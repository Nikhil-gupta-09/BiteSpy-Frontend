import { NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";
import type { CommunityPostDoc, CommunityReactionDoc } from "@/lib/community";
import { toObjectId } from "@/lib/community";

export const runtime = "nodejs";

interface ReactionBody {
    userKey?: string;
    reaction?: "like" | "dislike" | "none";
}

async function rebuildReactionCounts(postIdHex: string): Promise<{ like: number; dislike: number }> {
    const db = await getMongoDb();
    const reactionsCollection = db.collection<CommunityReactionDoc>("community_reactions");
    const postId = toObjectId(postIdHex);

    const grouped = await reactionsCollection
        .aggregate<{ _id: number; count: number }>([
            { $match: { postId } },
            { $group: { _id: "$value", count: { $sum: 1 } } },
        ])
        .toArray();

    const like = grouped.find((entry) => entry._id === 1)?.count || 0;
    const dislike = grouped.find((entry) => entry._id === -1)?.count || 0;

    return { like, dislike };
}

export async function POST(
    request: Request,
    context: { params: Promise<{ postId: string }> }
): Promise<Response> {
    try {
        const { postId: postIdParam } = await context.params;
        const postId = toObjectId(postIdParam);
        const body = (await request.json()) as ReactionBody;
        const userKey = typeof body.userKey === "string" ? body.userKey.trim() : "";
        const reaction = body.reaction;

        if (!userKey) {
            return NextResponse.json({ error: "Missing userKey." }, { status: 400 });
        }

        if (reaction !== "like" && reaction !== "dislike" && reaction !== "none") {
            return NextResponse.json({ error: "Invalid reaction value." }, { status: 400 });
        }

        const db = await getMongoDb();
        const postsCollection = db.collection<CommunityPostDoc>("community_posts");
        const reactionsCollection = db.collection<CommunityReactionDoc>("community_reactions");

        const existingPost = await postsCollection.findOne({ _id: postId });
        if (!existingPost) {
            return NextResponse.json({ error: "Post not found." }, { status: 404 });
        }

        if (reaction === "none") {
            await reactionsCollection.deleteOne({ postId, userKey });
        } else {
            await reactionsCollection.updateOne(
                { postId, userKey },
                {
                    $set: {
                        value: reaction === "like" ? 1 : -1,
                        updatedAt: new Date(),
                    },
                },
                { upsert: true }
            );
        }

        await reactionsCollection.createIndex({ postId: 1, userKey: 1 }, { unique: true });
        await reactionsCollection.createIndex({ postId: 1, updatedAt: -1 });

        const reactionCounts = await rebuildReactionCounts(postIdParam);
        await postsCollection.updateOne(
            { _id: postId },
            {
                $set: {
                    reactionCounts,
                    updatedAt: new Date(),
                },
            }
        );

        return NextResponse.json({
            postId: postIdParam,
            reactionCounts,
            currentUserReaction: reaction === "none" ? null : reaction,
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: "Failed to update reaction.",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
