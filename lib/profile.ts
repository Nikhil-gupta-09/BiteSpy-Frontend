export type UserProfile = {
    fullName: string;
    age: number;
    gender: string;
    height: number;
    weight: number;
    conditions: string[];
    diet: string;
    goal: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
};

export type UserProfileInput = Omit<UserProfile, "email" | "createdAt" | "updatedAt">;

export const emptyProfile: UserProfileInput = {
    fullName: "",
    age: 0,
    gender: "",
    height: 0,
    weight: 0,
    conditions: [],
    diet: "",
    goal: "",
};

export const PROFILE_EMAIL_STORAGE_KEY = "bitespy_user_email";

export function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

export function isProfileComplete(profile: UserProfileInput) {
    return (
        profile.fullName.trim() !== "" &&
        profile.age > 0 &&
        profile.gender.trim() !== "" &&
        profile.height > 0 &&
        profile.weight > 0 &&
        profile.diet.trim() !== "" &&
        profile.goal.trim() !== ""
    );
}

function toNumber(value: unknown) {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : NaN;
    }

    if (typeof value === "string" && value.trim() !== "") {
        return Number(value);
    }

    return NaN;
}

function toStringArray(value: unknown) {
    if (!Array.isArray(value)) {
        return [] as string[];
    }

    return value
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean);
}

export function parseProfilePayload(payload: unknown) {
    const data = (payload ?? {}) as Record<string, unknown>;
    const errors: string[] = [];

    const emailValue = typeof data.email === "string" ? normalizeEmail(data.email) : "";

    const profile: UserProfileInput = {
        fullName: typeof data.fullName === "string" ? data.fullName.trim() : "",
        age: toNumber(data.age),
        gender: typeof data.gender === "string" ? data.gender.trim() : "",
        height: toNumber(data.height),
        weight: toNumber(data.weight),
        conditions: toStringArray(data.conditions),
        diet: typeof data.diet === "string" ? data.diet.trim() : "",
        goal: typeof data.goal === "string" ? data.goal.trim() : "",
    };

    if (!emailValue) {
        errors.push("Email is required");
    }

    if (!profile.fullName) {
        errors.push("Full name is required");
    }

    if (!Number.isFinite(profile.age) || profile.age <= 0) {
        errors.push("Age must be a valid number");
    }

    if (!profile.gender) {
        errors.push("Gender is required");
    }

    if (!Number.isFinite(profile.height) || profile.height <= 0) {
        errors.push("Height must be a valid number");
    }

    if (!Number.isFinite(profile.weight) || profile.weight <= 0) {
        errors.push("Weight must be a valid number");
    }

    if (!profile.diet) {
        errors.push("Diet is required");
    }

    if (!profile.goal) {
        errors.push("Goal is required");
    }

    return {
        email: emailValue,
        profile,
        errors,
    };
}