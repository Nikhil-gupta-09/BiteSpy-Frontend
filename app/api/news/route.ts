import Parser from "rss-parser";

interface NewsItem {
    id: string;
    title: string;
    description: string;
    link: string;
    pubDate: string;
    source: string;
    category: string;
}

// RSS feeds organized by category
const RSS_FEEDS = {
    // Industry & Business
    "Industry & Business": [
        { url: "https://www.foodbusinessnews.net/rss", name: "Food Business News" },
        { url: "https://www.fooddive.com/feeds/news/", name: "Food Dive" },
        { url: "https://www.just-food.com/rss/", name: "Just Food" },
        { url: "https://foodindustryexecutive.com/feed/", name: "Food Industry Executive" },
        { url: "https://www.foodengineeringmag.com/rss", name: "Food Engineering Magazine" },
    ],
    // Food Safety & Regulations
    "Safety & Regulations": [
        { url: "https://www.foodsafetynews.com/feed/", name: "Food Safety News" },
        { url: "https://www.foodsafety.com/rss", name: "Food Safety Magazine" },
    ],
    // Global News
    "Global Food News": [
        { url: "https://foodnewsinternational.com/feed/", name: "Food News International" },
        { url: "https://www.foodbev.com/feed/", name: "FoodBev Media" },
    ],
    // General Coverage
    "General News": [
        { url: "https://feeds.bbci.co.uk/news/health/rss.xml", name: "BBC News - Health" },
        { url: "https://rss.nytimes.com/services/xml/rss/nyt/Food.xml", name: "New York Times - Food" },
    ],
};

const parser = new Parser({
    timeout: 5000,
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
});

// In-memory cache with timestamp
let cachedNews: { items: NewsItem[]; timestamp: number } | null = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export async function GET(): Promise<Response> {
    try {
        // Check cache
        const now = Date.now();
        if (cachedNews && now - cachedNews.timestamp < CACHE_DURATION) {
            return Response.json(cachedNews.items);
        }

        const allNews: NewsItem[] = [];

        // Fetch from all feeds in parallel with Promise.allSettled for resilience
        const feedPromises = Object.entries(RSS_FEEDS).flatMap(([category, feeds]) =>
            feeds.map(async (feed) => {
                try {
                    const data = await parser.parseURL(feed.url);

                    const newsItems: NewsItem[] = (data.items || []).map((item, index) => ({
                        id: `${feed.name}-${index}-${Date.now()}`,
                        title: item.title || "No Title",
                        description: item.content || item.summary || "No description available",
                        link: item.link || "#",
                        pubDate: item.pubDate || new Date().toISOString(),
                        source: feed.name,
                        category,
                    }));

                    return newsItems;
                } catch (error) {
                    // Silently fail and return empty array
                    return [];
                }
            })
        );

        const results = await Promise.allSettled(feedPromises);

        results.forEach((result) => {
            if (result.status === "fulfilled" && result.value) {
                allNews.push(...result.value);
            }
        });

        // Sort by date (latest first)
        allNews.sort((a, b) => {
            const dateA = new Date(a.pubDate).getTime();
            const dateB = new Date(b.pubDate).getTime();
            return dateB - dateA;
        });

        // Limit to latest 50 items
        const limitedNews = allNews.slice(0, 50);

        // Cache the results
        cachedNews = { items: limitedNews, timestamp: now };

        return Response.json(limitedNews);
    } catch (error) {
        console.error("Error fetching news:", error);
        return Response.json(
            { error: "Failed to fetch news", message: String(error) },
            { status: 500 }
        );
    }
}
