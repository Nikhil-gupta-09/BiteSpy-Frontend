export type QuestionFocus = "health" | "allergy" | "preference";

export interface IngredientQuestion {
    id: string;
    text: string;
    focus: QuestionFocus;
}

export interface ScanResult {
    scanId: string;
    productName: string;
    brand: string;
    category: string;
    cloudinaryUrl?: string;
    cloudinaryPublicId?: string;
    ingredients: string[];
    detectedLabels: string[];
    marketingClaims: string[];
    allergySignals: string[];
    healthConcerns: string[];
    questions: IngredientQuestion[];
}

export interface UserAnswer {
    questionId: string;
    question: string;
    answer: boolean;
}

export interface HarmfulIngredient {
    name: string;
    risk: string;
    whyItMatters: string;
}

export interface AlternativeProduct {
    name: string;
    reason: string;
    fit: "healthier" | "allergy-safe" | "preference-match" | "budget";
    priceTier: "low" | "medium" | "high";
}

export interface AnalysisResult {
    scanId: string;
    productName: string;
    claimOMeter: number;
    verdict: string;
    personalizedSummary: string;
    falseClaims: string[];
    harmfulIngredients: HarmfulIngredient[];
    labelAlerts: string[];
    goodPoints: string[];
    recommendedLabels: string[];
    ingredients: string[];
    alternatives: AlternativeProduct[];
    desiredDosage: string;
}
