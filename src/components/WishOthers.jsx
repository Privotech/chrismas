import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Search, Plus } from "lucide-react";
import { WISH_CATEGORIES } from "../utils/holidayUtils";
import { holidayAudio } from "../utils/holidayAudio";
import WishesGrid from "./WishesGrid";

export default function WishOthers() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest | reactions | oldest

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        let loaded = [];
        try {
          const res = await fetch("/api/wishes");
          if (res.ok) loaded = await res.json();
        } catch {
          // ignore
        }

        const local = JSON.parse(localStorage.getItem("wishes") || "[]");
        const merged = [...loaded];
        for (const lw of local) {
          if (!merged.some((w) => w.id === lw.id || (w.message === lw.message && w.name === lw.name))) {
            merged.push(lw);
          }
        }

        if (mounted) {
          setWishes(merged);
          setLoading(false);
        }
      } catch {
        if (mounted) {
          const local = JSON.parse(localStorage.getItem("wishes") || "[]");
          setWishes(local);
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleReact(wishId, reactionKey) {
    holidayAudio.playSparkle();

    // Optimistic update
    setWishes((prev) =>
      prev.map((w) => {
        if (w.id === wishId) {
          const currentReactions = w.reactions || { warmth: 0, cheer: 0, star: 0, hug: 0 };
          return {
            ...w,
            reactions: {
              ...currentReactions,
              [reactionKey]: (currentReactions[reactionKey] || 0) + 1,
            },
          };
        }
        return w;
      })
    );

    // Call API
    try {
      await fetch(`/api/wishes/${wishId}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reaction: reactionKey }),
      });
    } catch {
      // Optimistic state remains in memory
    }
  }

  const filteredWishes = useMemo(() => {
    let list = [...wishes];

    if (selectedCategory !== "all") {
      list = list.filter((w) => (w.category || "family") === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (w) =>
          (w.name && w.name.toLowerCase().includes(q)) ||
          (w.message && w.message.toLowerCase().includes(q))
      );
    }

    if (sortBy === "newest") {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === "reactions") {
      list.sort((a, b) => {
        const sumA = (a.reactions?.warmth || 0) + (a.reactions?.star || 0) + (a.reactions?.cheer || 0);
        const sumB = (b.reactions?.warmth || 0) + (b.reactions?.star || 0) + (b.reactions?.cheer || 0);
        return sumB - sumA;
      });
    } else if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    }

    return list;
  }, [wishes, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300 bg-amber-950/60 border border-amber-800/60 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Christmas 2026 Community Wall</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Wishes from Around the World
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Explore prayers, hopes, and joyful greetings penned by people everywhere. Send warmth, download cards as keepsakes, or add your own wish.
          </p>
        </div>

        <Link
          to="/make"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-crimson-950/50 transition-all hover:-translate-y-0.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Your Holiday Wish</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {WISH_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                selectedCategory === cat.id
                  ? "bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-sm"
                  : "bg-white/5 text-slate-400 border-white/5 hover:text-slate-200 hover:bg-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search and Sort */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search wishes or names…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-black/40 border border-slate-700/70 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-black/40 border border-slate-700/70 text-xs text-slate-300 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="reactions">Most Warmth</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Responsive Feed Grid using .glass-card styling */}
      <WishesGrid
        wishes={filteredWishes}
        loading={loading}
        onReact={handleReact}
      />
    </div>
  );
}
