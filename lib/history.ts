import { ObjectId } from "mongodb";
import type { AnalysisResult } from "@/lib/claim-analysis";

export interface UserSearchHistoryDoc {
    _id?: ObjectId;
    email: string;
    scanId: string;
    productName: string;
    claimOMeter: number;
    verdict: string;
    source: "image" | "name" | "unknown";
    result: AnalysisResult;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserSearchHistoryListItem {
    id: string;
    scanId: string;
    productName: string;
    claimOMeter: number;
    verdict: string;
    source: "image" | "name" | "unknown";
    createdAt: string;
}

export function toHistoryObjectId(id: string): ObjectId {
    if (!ObjectId.isValid(id)) {
        throw new Error("Invalid history id.");
    }

    return new ObjectId(id);
}
