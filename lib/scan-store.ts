import type { AnalysisResult, ScanResult } from "@/lib/claim-analysis";

const SCANS_TTL_MS = 30 * 60 * 1000;

interface StoredItem<T> {
    value: T;
    createdAt: number;
}

const scans = new Map<string, StoredItem<ScanResult>>();
const analyses = new Map<string, StoredItem<AnalysisResult>>();

function cleanupExpired() {
    const now = Date.now();

    for (const [key, item] of scans.entries()) {
        if (now - item.createdAt > SCANS_TTL_MS) {
            scans.delete(key);
        }
    }

    for (const [key, item] of analyses.entries()) {
        if (now - item.createdAt > SCANS_TTL_MS) {
            analyses.delete(key);
        }
    }
}

export function saveScan(scan: ScanResult) {
    cleanupExpired();
    scans.set(scan.scanId, { value: scan, createdAt: Date.now() });
}

export function getScan(scanId: string): ScanResult | null {
    cleanupExpired();
    return scans.get(scanId)?.value ?? null;
}

export function saveAnalysis(result: AnalysisResult) {
    cleanupExpired();
    analyses.set(result.scanId, { value: result, createdAt: Date.now() });
}

export function getAnalysis(scanId: string): AnalysisResult | null {
    cleanupExpired();
    return analyses.get(scanId)?.value ?? null;
}
