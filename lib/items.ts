import { ObjectId } from "mongodb";
import type { ScanResult } from "@/lib/claim-analysis";

export interface ItemDoc {
    _id?: ObjectId;
    key: string;
    productName: string;
    brand: string;
    category: string;
    ingredients: string[];
    detectedLabels: string[];
    marketingClaims: string[];
    allergySignals: string[];
    healthConcerns: string[];
    questions: ScanResult["questions"];
    verifiedReports: number;
    flagged: boolean;
    imageHashes: string[];
    createdAt: Date;
    updatedAt: Date;
    lastSeenAt: Date;
}

export function normalizeItemKey(productName: string, brand?: string, category?: string): string {
    return [productName, brand || "", category || ""]
        .map((part) => part.trim().toLowerCase().replace(/\s+/g, " "))
        .join("|");
}
