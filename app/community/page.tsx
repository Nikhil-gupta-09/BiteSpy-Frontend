"use client";

import { useEffect, useMemo, useState } from "react";
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
  comments: CommunityComment[];
  currentUserReaction: "like" | "dislike" | null;
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

function scorePillClass(score: number): string {
  if (score >= 7.5) {
    return "border-emerald-300/40 bg-emerald-500/20 text-emerald-100";
  }
  if (score >= 4.5) {
    return "border-amber-300/40 bg-amber-500/20 text-amber-100";
  }
  return "border-red-300/40 bg-red-500/20 text-red-100";
}

export default function CommunityPage() {
  const [userKey, setUserKey] = useState("");
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authorName, setAuthorName] = useState("Anonymous Spy");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [busyPostId, setBusyPostId] = useState<string | null>(null);

  useEffect(() => {
    const key = getOrCreateCommunityUserKey();
    setUserKey(key);

    const savedAuthor = localStorage.getItem("bitespy:community:authorName");
    if (savedAuthor) {
      setAuthorName(savedAuthor);
    }
  }, []);

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

    return () => {
      clearInterval(interval);
    };
  }, [userKey]);

  const publishAuthorName = () => {
    const normalized = authorName.trim() || "Anonymous Spy";
    setAuthorName(normalized);
    localStorage.setItem("bitespy:community:authorName", normalized);
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
        headers: {
          "Content-Type": "application/json",
        },
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorName,
          text,
        }),
      });

      const payload = (await response.json()) as {
        comment?: CommunityComment;
        error?: string;
      };

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
            Share your product verdicts, react to other reports, and compare label reality with the community.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <input
              value={authorName}
              onChange={(event) => setAuthorName(event.target.value)}
              placeholder="Display name"
              className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm text-white outline-none placeholder:text-blue-200/70"
            />
            <button
              type="button"
              onClick={publishAuthorName}
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#08225a] transition hover:scale-[1.02]"
            >
              Save Name
            </button>
            <div className="rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
              {posts.length} posts · {totalReactions} reactions
            </div>
          </div>
        </div>

        {error ? (
          <p className="mb-6 rounded-xl border border-red-300/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p>
        ) : null}

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
                    <p className="mt-2 text-blue-100">{post.personalizedSummary}</p>
                  </div>

                  <div className={`rounded-xl border px-4 py-2 text-sm font-semibold ${scorePillClass(post.claimOMeter)}`}>
                    Score {post.claimOMeter}/10
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {post.falseClaims.slice(0, 3).map((claim) => (
                    <span key={claim} className="rounded-full border border-red-300/30 bg-red-400/10 px-3 py-1 text-xs text-red-100">
                      {claim}
                    </span>
                  ))}
                  {post.harmfulIngredients.slice(0, 3).map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-orange-300/30 bg-orange-400/10 px-3 py-1 text-xs text-orange-100"
                    >
                      {item}
                    </span>
                  ))}
                </div>

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
                    👍 Like {post.reactionCounts.like}
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
                    👎 Dislike {post.reactionCounts.dislike}
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
                      placeholder="Write a comment"
                      className="w-full rounded-xl border border-white/25 bg-[#030c2a] px-4 py-2 text-sm text-white outline-none placeholder:text-blue-200/70"
                    />
                    <button
                      type="button"
                      disabled={busyPostId === post.id || !commentText.trim()}
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
            No posts yet. Share a result from the report page to start the community digest.
          </div>
        ) : null}
      </section>
    </main>
  );
}
