"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { FiRefreshCw } from "react-icons/fi";
import NewsFlashcard from "./NewsFlashcard";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
}

export default function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/news");
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data: NewsItem[] = await response.json();
      setNews(data);
      setCurrentPage(1); // reset page on refresh
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch news");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchNews, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // PAGINATION LOGIC
  const totalPages = Math.ceil(news.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNews = news.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // LOADING
  if (loading && !news.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <FiRefreshCw className="animate-spin text-blue-400" size={28} />
        <p className="text-blue-200">Scanning data...</p>
      </div>
    );
  }

  // ERROR
  if (error && !news.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 px-6">
        <AlertCircle className="text-red-400" size={28} />
        <p className="text-blue-200">{error}</p>
        <button
          onClick={fetchNews}
          className="
            mt-2 px-5 py-2 rounded-lg
            bg-white/10 text-blue-100 border border-white/20
            hover:bg-white/20 transition
          "
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 mb-8">
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Live Feed
        </h2>

        <button
          onClick={fetchNews}
          className="
            group flex items-center justify-center
            w-10 h-10 rounded-full
            bg-white/5 border border-white/10
            hover:bg-white/10 transition
          "
        >
          <FiRefreshCw
            size={18}
            className={`
              text-blue-200 
              transition-transform duration-500
              ${loading ? "animate-spin" : "group-hover:rotate-180"}
            `}
          />
        </button>
      </div>

      {/* LIST (1 CARD PER ROW) */}
      {currentNews.length > 0 ? (
        <div className="px-6 flex flex-col gap-6">
          {currentNews.map((item) => (
            <NewsFlashcard key={item.id} {...item} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-blue-200">No data available</p>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`
                w-9 h-9 rounded-md text-sm font-medium
                border transition
                ${
                  currentPage === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white/5 text-blue-200 border-white/10 hover:bg-white/10"
                }
              `}
            >
              {page}
            </button>
          ))}

        </div>
      )}
    </div>
  );
}