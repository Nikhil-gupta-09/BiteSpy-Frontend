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

  // A helper function to assign different border colors based on category
  const getCategoryColor = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower.includes("press") || lower.includes("release")) return "border-red-500 text-red-500";
    if (lower.includes("ir")) return "border-red-500 text-red-500";
    if (lower.includes("achievement")) return "border-red-500 text-red-500";
    if (lower.includes("tech") || lower.includes("dev")) return "border-blue-500 text-blue-500";
    if (lower.includes("business") || lower.includes("industry")) return "border-emerald-500 text-emerald-500";
    // default
    return "border-rose-500 text-rose-500";
  };

  return (
    <article
      className="
        bg-white
        flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8
        p-5 sm:px-6 sm:py-5 border border-gray-100 shadow-sm
        hover:shadow-md transition-shadow duration-300
        rounded-xl
      "
    >
      {/* LEFT SECTION: Category & Date */}
      <div className="flex items-center gap-4 sm:gap-6 shrink-0 sm:w-[260px] md:w-[320px]">
        {/* Category Box */}
        <div 
          className={`
            flex items-center justify-center 
            px-3 py-1 
            border w-28 text-xs font-semibold
            rounded bg-white
            ${getCategoryColor(category || 'general')}
          `}
        >
          <span className="truncate w-full text-center">
            {category || "News"}
          </span>
        </div>
        
        {/* Date */}
        <div className="text-gray-500 text-sm font-medium whitespace-nowrap hidden sm:block">
          {formattedDate}
        </div>
      </div>

      {/* Date for Mobile (appears below category but before title) */}
      <div className="text-gray-500 text-xs font-medium sm:hidden -mt-2">
        {formattedDate}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
        
        {/* Title & Description Column */}
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-[1.05rem] font-semibold text-slate-800 leading-snug hover:text-blue-600 transition w-full pr-4">
            {title}
          </h3>

          <div className="mt-2 border-t border-gray-50 pt-2">
            <p className="text-sm text-slate-600/80 leading-relaxed line-clamp-2">
              {cleanDescription || "No additional description available."}
            </p>
            <span className="text-xs font-medium text-slate-400 mt-2 block">Source: {source}</span>
          </div>
        </div>

        {/* OPEN SOURCE ACTION BUTTON */}
        <div className="shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100 w-full sm:w-auto">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex sm:inline-flex items-center justify-center gap-2 px-5 py-2.5
              bg-blue-600 text-white text-xs font-bold rounded-lg
              hover:bg-blue-700 transition-all shadow-sm hover:shadow-md
              w-full sm:w-auto
            "
          >
            Open Source <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </article>
  );
}