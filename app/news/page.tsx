"use client";

import NewsFeed from "@/components/NewsFeed";

export default function NewsPage() {
  return (
    <main className="min-h-screen py-12 text-white">

      {/* Content */}
      <div className="relative z-10 px-16">
        <NewsFeed />
      </div>

    </main>
  );
}