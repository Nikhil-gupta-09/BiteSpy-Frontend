"use client";

import { useEffect, useMemo, useState } from "react";
import { PROFILE_EMAIL_STORAGE_KEY, type UserProfile, emptyProfile } from "@/lib/profile";

type LoadState = "loading" | "ready" | "error";

export default function ProfilePage() {
  const [status, setStatus] = useState<LoadState>("loading");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editable, setEditable] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const normalizedProfile = useMemo(() => {
    if (!profile) {
      return null;
    }

    return {
      ...emptyProfile,
      ...profile,
      age: profile.age ?? 0,
      height: profile.height ?? 0,
      weight: profile.weight ?? 0,
      conditions: Array.isArray(profile.conditions) ? profile.conditions : [],
    };
  }, [profile]);

  useEffect(() => {
    let active = true;
    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const payload = (await response.json()) as { user?: { email?: string } | null };
        const resolvedEmail = payload.user?.email || localStorage.getItem(PROFILE_EMAIL_STORAGE_KEY) || "";

        if (!active) {
          return;
        }

        if (resolvedEmail) {
          localStorage.setItem(PROFILE_EMAIL_STORAGE_KEY, resolvedEmail);
          setEmail(resolvedEmail);
        } else {
          setError("Sign in to view your profile.");
          setStatus("error");
        }
      } catch {
        if (active) {
          setError("Sign in to view your profile.");
          setStatus("error");
        }
      }
    };

    void loadSession();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!email) {
      console.log("[profile] No email, skipping fetch");
      return;
    }

    let active = true;

    const loadProfile = async () => {
      console.log("[profile] Starting fetch for email:", email);
      setStatus("loading");
      setError("");

      try {
        const url = `/api/profile`;
        console.log("[profile] Fetching:", url);
        const response = await fetch(url, {
          cache: "no-store",
        });

        const body = await response.json().catch(() => null);
        console.log("[profile] Fetch response:", { status: response.status, body });

        if (!response.ok) {
          throw new Error(body?.error ?? "Failed to load profile");
        }

        if (!active) {
          console.log("[profile] Fetch completed but component unmounted");
          return;
        }

        setProfile(body.profile);
        setStatus("ready");
        console.log("[profile] Profile loaded successfully");
      } catch (err) {
        if (!active) {
          console.log("[profile] Error caught but component unmounted");
          return;
        }

        console.error("[profile] Fetch error:", err);
        setProfile(null);
        setStatus("error");
        setError(err instanceof Error ? err.message : "Failed to load profile");
      }
    };

    void loadProfile();

    return () => {
      active = false;
    };
  }, [email]);

  const handleChange = (field: keyof UserProfile, value: string | number | string[]) => {
    if (!normalizedProfile) {
      return;
    }

    setProfile({
      ...normalizedProfile,
      [field]: value,
    });
  };

  const handleSave = async () => {
    if (!normalizedProfile || !email) {
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const { email: _profileEmail, ...profileData } = normalizedProfile;

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...profileData,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Failed to update profile");
      }

      const body = (await response.json()) as { profile: UserProfile };
      setProfile(body.profile);
      setEditable(false);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return <div className="min-h-screen px-6 py-12 text-white">Loading profile...</div>;
  }

  if (status === "error" && !profile) {
    return <div className="min-h-screen px-6 py-12 text-white">{error || "Unable to load profile."}</div>;
  }

  const fieldClass =
    "w-full rounded-md border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/40";

  return (
    <main className="min-h-screen px-6 py-10 text-white">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-[#030f36]/60 p-6 shadow-xl backdrop-blur-md">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Profile</h1>
            <p className="text-sm text-blue-200">{email}</p>
          </div>

          <button
            type="button"
            onClick={() => setEditable((prev) => !prev)}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-[#030f36]"
          >
            {editable ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {message && <p className="mb-4 rounded-md border border-green-400/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">{message}</p>}
        {error && <p className="mb-4 rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

        {!normalizedProfile ? null : editable ? (
          <div className="grid gap-4 md:grid-cols-2">
            <input className={fieldClass} value={normalizedProfile.fullName} onChange={(e) => handleChange("fullName", e.target.value)} placeholder="Full name" />
            <input className={fieldClass} value={normalizedProfile.age || ""} onChange={(e) => handleChange("age", Number(e.target.value))} placeholder="Age" type="number" />
            <input className={fieldClass} value={normalizedProfile.gender} onChange={(e) => handleChange("gender", e.target.value)} placeholder="Gender" />
            <input className={fieldClass} value={normalizedProfile.height || ""} onChange={(e) => handleChange("height", Number(e.target.value))} placeholder="Height" type="number" />
            <input className={fieldClass} value={normalizedProfile.weight || ""} onChange={(e) => handleChange("weight", Number(e.target.value))} placeholder="Weight" type="number" />
            <input className={fieldClass} value={normalizedProfile.diet} onChange={(e) => handleChange("diet", e.target.value)} placeholder="Diet" />
            <input className={fieldClass} value={normalizedProfile.goal} onChange={(e) => handleChange("goal", e.target.value)} placeholder="Goal" />
            <input className={fieldClass} value={normalizedProfile.conditions.join(", ")} onChange={(e) => handleChange("conditions", e.target.value.split(",").map((item) => item.trim()).filter(Boolean))} placeholder="Conditions, comma separated" />

            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditable(false)}
                className="rounded-md border border-white/20 px-4 py-2 text-sm"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-[#030f36] disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <ProfileRow label="Full Name" value={normalizedProfile.fullName} />
            <ProfileRow label="Age" value={String(normalizedProfile.age)} />
            <ProfileRow label="Gender" value={normalizedProfile.gender} />
            <ProfileRow label="Height" value={`${normalizedProfile.height} cm`} />
            <ProfileRow label="Weight" value={`${normalizedProfile.weight} kg`} />
            <ProfileRow label="Conditions" value={normalizedProfile.conditions.length ? normalizedProfile.conditions.join(", ") : "None"} />
            <ProfileRow label="Diet" value={normalizedProfile.diet} />
            <ProfileRow label="Goal" value={normalizedProfile.goal} />
          </div>
        )}
      </div>
    </main>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-blue-200">{label}</p>
      <p className="mt-2 text-base text-white">{value || "—"}</p>
    </div>
  );
}