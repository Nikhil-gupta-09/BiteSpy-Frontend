"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import Navbar from "@/components/Navbar";

interface CommunityComment {
  id: string;
  authorName: string;
  text: string;
  createdAt: string;
}

interface CommunityPost {
  id: string;
  postType: "analysis" | "user";
  scanId: string;
  productName: string;
  bodyText?: string;
  mediaUrl?: string;
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
  comments: CommunityComment[];
  currentUserReaction: "like" | "dislike" | null;
}

interface SessionUser {
  email: string;
  fullName: string;
  verified: boolean;
}

interface PostsResponse {
  posts: CommunityPost[];
}

function getOrCreateCommunityUserKey(): string {
  const keyName = "bitespy:community:userKey";
  const existing = localStorage.getItem(keyName);
  if (existing) {
    return existing;
  }

  const created = `anon_${crypto.randomUUID()}`;
  localStorage.setItem(keyName, created);
  return created;
}

async function uploadToCloudinary(file: File): Promise<{ secureUrl: string; publicId: string } | null> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "bitespy/community");

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Cloudinary upload failed: ${message}`);
  }

  const payload = (await response.json()) as { secure_url?: string; public_id?: string };
  if (!payload.secure_url || !payload.public_id) {
    throw new Error("Cloudinary did not return a usable media URL.");
  }

  return { secureUrl: payload.secure_url, publicId: payload.public_id };
}

function CommunityContent() {
  const searchParams = useSearchParams();
  const [userKey, setUserKey] = useState("");
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [busyPostId, setBusyPostId] = useState<string | null>(null);

  const [composerOpen, setComposerOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [postFile, setPostFile] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const key = getOrCreateCommunityUserKey();
    setUserKey(key);

    let active = true;
    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const payload = (await response.json()) as { user?: SessionUser | null };
        if (active) {
          setSessionUser(payload.user ?? null);
        }
      } catch {
        if (active) {
          setSessionUser(null);
        }
      }
    };

    void loadSession();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (searchParams.get("compose") === "1") {
      setComposerOpen(true);
    }
  }, [searchParams]);

  const loadPosts = async (silent = false) => {
    if (!userKey) {
      return;
    }

    if (!silent) {
      setLoading(true);
    }

    try {
      const response = await fetch(`/api/community/posts?limit=25&userKey=${encodeURIComponent(userKey)}`);
      const payload = (await response.json()) as PostsResponse | { error?: string; message?: string };

      if (!response.ok || !("posts" in payload)) {
        const err = "error" in payload ? payload.error || payload.message : "Failed to load posts.";
        throw new Error(err || "Failed to load posts.");
      }

      setPosts(payload.posts);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load community feed.");
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!userKey) {
      return;
    }

    void loadPosts();
    const interval = setInterval(() => {
      void loadPosts(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [userKey]);

  const createCustomPost = async () => {
    if (!sessionUser?.verified || isPosting) {
      return;
    }

    const title = postTitle.trim();
    const text = postText.trim();
    if (!title || !text) {
      setError("Post title and text are required.");
      return;
    }

    setIsPosting(true);
    try {
      let mediaUrl: string | undefined;
      let mediaPublicId: string | undefined;

      if (postFile) {
        const uploaded = await uploadToCloudinary(postFile);
        if (uploaded) {
          mediaUrl = uploaded.secureUrl;
          mediaPublicId = uploaded.publicId;
        }
      }

      const response = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: title,
          text,
          mediaUrl,
          mediaPublicId,
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || "Could not publish post.");
      }

      setPostTitle("");
      setPostText("");
      setPostFile(null);
      setComposerOpen(false);
      await loadPosts(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not publish post.");
    } finally {
      setIsPosting(false);
    }
  };

  const applyReaction = async (post: CommunityPost, next: "like" | "dislike") => {
    if (!userKey) {
      return;
    }

    const reaction: "like" | "dislike" | "none" = post.currentUserReaction === next ? "none" : next;
    setBusyPostId(post.id);

    try {
      const response = await fetch(`/api/community/posts/${post.id}/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userKey, reaction }),
      });

      const payload = (await response.json()) as {
        reactionCounts?: { like: number; dislike: number };
        currentUserReaction?: "like" | "dislike" | null;
      };

      if (!response.ok || !payload.reactionCounts) {
        throw new Error("Could not update reaction.");
      }

      setPosts((current) =>
        current.map((item) =>
          item.id === post.id
            ? {
                ...item,
                reactionCounts: payload.reactionCounts || item.reactionCounts,
                currentUserReaction: payload.currentUserReaction ?? null,
              }
            : item
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update reaction.");
    } finally {
      setBusyPostId(null);
    }
  };

  const addComment = async (postId: string) => {
    const text = (commentDrafts[postId] || "").trim();
    if (!text) {
      return;
    }

    setBusyPostId(postId);

    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const payload = (await response.json()) as { comment?: CommunityComment; error?: string };

      if (!response.ok || !payload.comment) {
        throw new Error(payload.error || "Could not post comment.");
      }

      setPosts((current) =>
        current.map((post) =>
          post.id === postId
            ? {
                ...post,
                commentCount: post.commentCount + 1,
                comments: [...post.comments, payload.comment as CommunityComment],
              }
            : post
        )
      );
      setCommentDrafts((current) => ({ ...current, [postId]: "" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post comment.");
    } finally {
      setBusyPostId(null);
    }
  };

  const totalReactions = useMemo(
    () => posts.reduce((sum, post) => sum + post.reactionCounts.like + post.reactionCounts.dislike, 0),
    [posts]
  );

  return (
    <main className="min-h-screen pb-16">
      <Navbar />

      <section className="mx-auto w-full max-w-6xl px-6 pt-28">
        <div className="mb-8 rounded-3xl border border-white/20 bg-[#071340]/85 p-6">
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">BiteSpy Community Digest</h1>
          <p className="mt-3 text-blue-100">
            Share verdicts, discuss labels, and react to food-claim investigations.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
              {posts.length} posts · {totalReactions} reactions
            </div>
            <div className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-blue-100">
              {sessionUser ? `Logged in as ${sessionUser.fullName || sessionUser.email}` : "Login to comment and post"}
            </div>
            {sessionUser?.verified ? (
              <button
                type="button"
                onClick={() => setComposerOpen((prev) => !prev)}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#08225a] transition hover:scale-[1.02]"
              >
                {composerOpen ? "Close Composer" : "Create Post"}
              </button>
            ) : null}
          </div>
        </div>

        {composerOpen && sessionUser?.verified ? (
          <div className="mb-8 rounded-3xl border border-emerald-300/30 bg-emerald-500/10 p-5">
            <h2 className="text-xl font-bold text-emerald-100">Create Verified Post</h2>
            <p className="mt-1 text-sm text-emerald-50">Only verified users can publish custom community posts.</p>

            <div className="mt-4 space-y-3">
              <input
                value={postTitle}
                onChange={(event) => setPostTitle(event.target.value)}
                placeholder="Post title (for example: Is this drink really sugar free?)"
                className="w-full rounded-xl border border-white/20 bg-[#091842] px-4 py-3 text-white outline-none placeholder:text-slate-300"
              />
              <textarea
                value={postText}
                onChange={(event) => setPostText(event.target.value)}
                placeholder="Write your post text"
                rows={4}
                className="w-full rounded-xl border border-white/20 bg-[#091842] px-4 py-3 text-white outline-none placeholder:text-slate-300"
              />
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => setPostFile(event.target.files?.[0] || null)}
                className="block w-full text-sm text-blue-100"
              />
              <button
                type="button"
                onClick={() => void createCustomPost()}
                disabled={isPosting}
                className="rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-[#05204f] transition hover:scale-[1.02] disabled:opacity-60"
              >
                {isPosting ? "Publishing..." : "Publish Post"}
              </button>
            </div>
          </div>
        ) : null}

        {error ? <p className="mb-6 rounded-xl border border-red-300/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p> : null}
        {loading ? <p className="text-blue-100">Loading community feed...</p> : null}

        <div className="space-y-6">
          {posts.map((post) => {
            const createdAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
            const commentText = commentDrafts[post.id] || "";

            return (
              <article key={post.id} className="rounded-3xl border border-white/20 bg-[#050f31]/90 p-6 backdrop-blur-xl">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-blue-200">
                      Shared by <span className="font-semibold text-white">{post.authorName}</span> · {createdAgo}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-white">{post.productName}</h2>
                    <p className="mt-2 text-blue-100">{post.bodyText || post.personalizedSummary}</p>
                  </div>

                  {post.postType === "analysis" ? (
                    <div className="rounded-xl border border-cyan-300/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100">
                      Score {post.claimOMeter}/10
                    </div>
                  ) : (
                    <div className="rounded-xl border border-emerald-300/40 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-100">
                      Verified Post
                    </div>
                  )}
                </div>

                {post.mediaUrl ? (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-white/15">
                    <Image src={post.mediaUrl} alt={post.productName} width={900} height={600} className="h-auto w-full object-cover" unoptimized />
                  </div>
                ) : null}

                {post.postType === "analysis" && (post.falseClaims.length || post.harmfulIngredients.length) ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.falseClaims.slice(0, 3).map((claim) => (
                      <span key={claim} className="rounded-full border border-red-300/30 bg-red-400/10 px-3 py-1 text-xs text-red-100">
                        {claim}
                      </span>
                    ))}
                    {post.harmfulIngredients.slice(0, 3).map((item) => (
                      <span key={item} className="rounded-full border border-orange-300/30 bg-orange-400/10 px-3 py-1 text-xs text-orange-100">
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={busyPostId === post.id}
                    onClick={() => void applyReaction(post, "like")}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                      post.currentUserReaction === "like"
                        ? "border-emerald-300/40 bg-emerald-500/20 text-emerald-100"
                        : "border-white/25 bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    Like {post.reactionCounts.like}
                  </button>

                  <button
                    type="button"
                    disabled={busyPostId === post.id}
                    onClick={() => void applyReaction(post, "dislike")}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                      post.currentUserReaction === "dislike"
                        ? "border-red-300/40 bg-red-500/20 text-red-100"
                        : "border-white/25 bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    Dislike {post.reactionCounts.dislike}
                  </button>

                  <span className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-blue-100">
                    {post.commentCount} comments
                  </span>
                </div>

                <div className="mt-5 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  {post.comments.length ? (
                    post.comments.map((comment) => (
                      <div key={comment.id} className="rounded-xl border border-white/10 bg-[#071340]/70 px-4 py-3">
                        <p className="text-xs text-blue-200">
                          {comment.authorName} · {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </p>
                        <p className="mt-1 text-sm text-white">{comment.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-blue-200">No comments yet. Start the discussion.</p>
                  )}

                  <div className="flex flex-col gap-3 md:flex-row">
                    <input
                      value={commentText}
                      onChange={(event) =>
                        setCommentDrafts((current) => ({
                          ...current,
                          [post.id]: event.target.value,
                        }))
                      }
                      placeholder={sessionUser ? "Write a comment" : "Login to comment"}
                      disabled={!sessionUser}
                      className="w-full rounded-xl border border-white/25 bg-[#030c2a] px-4 py-2 text-sm text-white outline-none placeholder:text-blue-200/70 disabled:opacity-60"
                    />
                    <button
                      type="button"
                      disabled={busyPostId === post.id || !commentText.trim() || !sessionUser}
                      onClick={() => void addComment(post.id)}
                      className="rounded-xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-[#05204f] transition hover:scale-[1.02] disabled:opacity-60"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {!loading && !posts.length ? (
          <div className="mt-8 rounded-2xl border border-white/20 bg-white/5 p-6 text-blue-100">
            No posts yet. Share a result from the report page or create one if you are verified.
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default function CommunityPage() {
  return (
    <Suspense fallback={<main className="min-h-screen pb-16"><Navbar /><section className="mx-auto w-full max-w-6xl px-6 pt-28"><p className="text-blue-100">Loading community...</p></section></main>}>
      <CommunityContent />
    </Suspense>
  );
}
