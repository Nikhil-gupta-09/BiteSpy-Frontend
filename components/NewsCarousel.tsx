"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
}

const MAX_NEWS_ITEMS = 15;
const VISIBLE_CARDS = 5;

function cleanDescription(description: string) {
  return description
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();
}

function formatPublishedAt(pubDate: string) {
  try {
    const date = new Date(pubDate);
    if (!Number.isNaN(date.getTime())) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
  } catch {
    // Fall through to the raw value below.
  }

  return pubDate;
}

export default function NewsCarousel() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/news");
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: NewsItem[] = await response.json();
      setNews(data.slice(0, MAX_NEWS_ITEMS));
      setStartIndex(0);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error ? fetchError.message : "Failed to fetch news"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const hasNews = news.length > 0;
  const maxStartIndex = Math.max(0, news.length - VISIBLE_CARDS);
  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex < maxStartIndex;
  const visibleNews = news.slice(startIndex, startIndex + VISIBLE_CARDS);

  const goPrev = () => {
    setDirection(-1);
    setStartIndex((current) => Math.max(0, current - 1));
  };

  const goNext = () => {
    setDirection(1);
    setStartIndex((current) => Math.min(maxStartIndex, current + 1));
  };

  return (
    <section className="px-6 py-10">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">News Flash</h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={!canGoPrev}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous cards"
          >
            <ChevronLeft size={18} />
          </button>

          {canGoNext ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/20 px-4 text-sm font-medium text-white transition hover:bg-white/10"
              aria-label="Next cards"
            >
              Next
              <ChevronRight size={16} />
            </button>
          ) : (
            <Link
              href="/news"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-[#0B2545] transition hover:bg-blue-50"
            >
              More news
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>

      {loading && !hasNews ? (
        <div className="flex min-h-44 items-center justify-center rounded-2xl border border-white/15 text-blue-100">
          <div className="flex items-center gap-2 text-sm">
            <Loader2 size={16} className="animate-spin" />
            Loading news cards...
          </div>
        </div>
      ) : error && !hasNews ? (
        <div className="flex min-h-44 flex-col items-center justify-center gap-3 rounded-2xl border border-white/15 px-4 text-center text-blue-100">
          <p className="text-sm">{error}</p>
          <button
            type="button"
            onClick={fetchNews}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0B2545]"
          >
            Retry
          </button>
        </div>
      ) : !hasNews ? (
        <div className="flex min-h-44 flex-col items-center justify-center gap-3 rounded-2xl border border-white/15 px-4 text-center text-blue-100">
          <p className="text-sm">No news available right now.</p>
          <button
            type="button"
            onClick={fetchNews}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0B2545]"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={startIndex}
              custom={direction}
              variants={{
                initial: (currentDirection: number) => ({
                  x: currentDirection > 0 ? 48 : -48,
                  opacity: 0,
                }),
                animate: {
                  x: 0, 
                  opacity: 1,
                  transition: { duration: 0.3, ease: "easeInOut" }
                },
                exit: (currentDirection: number) => ({
                  x: currentDirection > 0 ? -48 : 48,
                  opacity: 0,
                  transition: { duration: 0.3, ease: "easeInOut" }
                })
              }}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-row gap-4"
            >
              {visibleNews.map((item) => (
                <article
                  key={item.id}
                  className="flex min-w-0 flex-1 flex-col rounded-2xl border border-[#e6dcc9] bg-[#f7f1e4] p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-2 text-xs text-[#5f5548]">
                    <span className="truncate">{item.source}</span>
                    <span className="shrink-0">{formatPublishedAt(item.pubDate)}</span>
                  </div>

                  <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-[#2f2921] sm:text-base">
                    {item.title}
                  </h3>

                  <p className="mb-4 line-clamp-4 text-xs leading-5 text-[#4c4338] sm:text-sm">
                    {cleanDescription(item.description)}
                  </p>

                  <Link
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-[#7a4e1f] hover:text-[#4e3314]"
                  >
                    Open
                    <ArrowRight size={14} />
                  </Link>
                </article>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}