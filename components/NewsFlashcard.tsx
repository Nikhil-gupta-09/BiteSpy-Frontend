"use client";

import { formatDistanceToNow } from "date-fns";
import { ExternalLink, ChevronRight } from "lucide-react";
import { useState } from "react";

interface NewsFlashcardProps {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
}

export default function NewsFlashcard({
  title,
  description,
  link,
  pubDate,
  source,
  category,
}: NewsFlashcardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  let formattedDate = "Unknown";
  try {
    const date = new Date(pubDate);
    if (!isNaN(date.getTime())) {
      formattedDate = formatDistanceToNow(date, { addSuffix: true });
    }
  } catch {
    formattedDate = pubDate;
  }

  const cleanDescription = description
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

  return (
    <article
      className="
        relative flex flex-col justify-between
        bg-[#DFF5FF] border border-blue-200
        rounded-2xl p-5
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-200/30
        cursor-pointer
      "
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* LEFT ACCENT BAR */}
      <div className="absolute left-0 top-0 h-full w-[3px] bg-blue-500 rounded-l-2xl" />

      {/* TOP META */}
      <div className="flex items-center justify-between text-xs mb-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-blue-700 uppercase tracking-wide">
            {category}
          </span>
          <span className="text-blue-500/70">• {source}</span>
        </div>
        <span className="text-gray-500 italic">{formattedDate}</span>
      </div>

      {/* TITLE */}
      <h3 className="text-[1.05rem] font-semibold text-[#0B2545] leading-snug mb-2 hover:text-blue-700 transition">
        {title}
      </h3>

      {/* DESCRIPTION */}
      <p
        className={`text-sm text-slate-700 leading-relaxed mb-4 ${
          isExpanded ? "" : "line-clamp-2"
        }`}
      >
        {cleanDescription}
      </p>

      {/* ACTION ROW */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-blue-200/60">
        
        {/* EXPAND */}
        <button
          className="text-xs text-blue-600 hover:text-blue-800 transition flex items-center gap-1"
        >
          {isExpanded ? "Show less" : "Read preview"}
        </button>

        {/* LINK */}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="
            flex items-center gap-1 text-sm font-medium
            text-blue-700 hover:text-blue-900
            transition
          "
        >
          Open <ChevronRight size={16} />
        </a>
      </div>
    </article>
  );
}