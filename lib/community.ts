import { ObjectId } from "mongodb";
import type { AnalysisResult } from "@/lib/claim-analysis";

export interface CommunityPostDoc {
    _id?: ObjectId;
    scanId: string;
    productName: string;
    claimOMeter: number;
    verdict: string;
    personalizedSummary: string;
    falseClaims: string[];
    harmfulIngredients: string[];
    labelAlerts: string[];
    recommendedLabels: string[];
    authorName: string;
    createdAt: Date;
    updatedAt: Date;
    reactionCounts: {
        like: number;
        dislike: number;
    };
    commentCount: number;
}

export interface CommunityCommentDoc {
    _id?: ObjectId;
    postId: ObjectId;
    authorName: string;
    text: string;
    createdAt: Date;
}

export interface CommunityReactionDoc {
    _id?: ObjectId;
    postId: ObjectId;
    userKey: string;
    value: 1 | -1;
    updatedAt: Date;
}

export interface CommunityPostView {
    id: string;
    scanId: string;
    productName: string;
    claimOMeter: number;
    verdict: string;
    personalizedSummary: string;
    falseClaims: string[];
    harmfulIngredients: string[];
    labelAlerts: string[];
    recommendedLabels: string[];
    authorName: string;
    createdAt: string;
    updatedAt: string;
    reactionCounts: {
        like: number;
        dislike: number;
    };
    commentCount: number;
    comments: Array<{
        id: string;
        authorName: string;
        text: string;
        createdAt: string;
    }>;
    currentUserReaction: "like" | "dislike" | null;
}

export function normalizeAuthorName(raw: unknown): string {
    if (typeof raw !== "string") {
        return "Anonymous Spy";
    }

    const value = raw.trim();
    if (!value) {
        return "Anonymous Spy";
    }

    return value.slice(0, 40);
}

export function toPostDocument(result: AnalysisResult, authorName: string): CommunityPostDoc {
    const now = new Date();
    return {
        scanId: result.scanId,
        productName: result.productName,
        claimOMeter: result.claimOMeter,
        verdict: result.verdict,
        personalizedSummary: result.personalizedSummary,
        falseClaims: result.falseClaims.slice(0, 5),
        harmfulIngredients: result.harmfulIngredients.map((item) => item.name).slice(0, 6),
        labelAlerts: result.labelAlerts.slice(0, 6),
        recommendedLabels: result.recommendedLabels.slice(0, 6),
        authorName,
        createdAt: now,
        updatedAt: now,
        reactionCounts: {
            like: 0,
            dislike: 0,
        },
        commentCount: 0,
    };
}

export function toObjectId(id: string): ObjectId {
    if (!ObjectId.isValid(id)) {
        throw new Error("Invalid post id.");
    }

    return new ObjectId(id);
}
