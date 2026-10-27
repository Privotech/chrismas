import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, Share2, Download, Check, Plus } from "lucide-react";
import { CARD_THEMES, WISH_CATEGORIES, formatWishTime } from "../utils/holidayUtils";
import { downloadHolidayCard } from "../utils/cardExporter";

export default function WishesGrid({ wishes = [], loading = false, onReact }) {
  const [copiedId, setCopiedId] = useState(null);

  function handleShare(wish) {
    const textToCopy = `"${wish.message}" — ${wish.name || "Anonymous"} (Christmas Wishes 2026)`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedId(wish.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }

  function handleDownload(wish) {
    downloadHolidayCard(wish);
  }

  // Loading Skeleton State with .glass-card
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="glass-card animate-pulse space-y-4 min-h-[220px] flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-white/10 rounded-full" />
                <div className="h-3 w-16 bg-white/10 rounded-full" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-4 w-full bg-white/10 rounded" />
                <div className="h-4 w-5/6 bg-white/10 rounded" />
                <div className="h-4 w-3/4 bg-white/10 rounded" />
              </div>
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="h-4 w-20 bg-white/10 rounded" />
              <div className="h-6 w-28 bg-white/10 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty State with .glass-card
  if (!wishes || wishes.length === 0) {
    return (
      <div className="glass-card text-center py-16 px-6 space-y-4 max-w-xl mx-auto">
        <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-3xl">
          🎄
        </div>
        <div className="space-y-1">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
            No Holiday Wishes Found
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            There are no wishes matching this selection yet. Be the first to kindle the festive spirit by sharing one!
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/make"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-crimson-950/40 transition-transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Make a Christmas Wish</span>
          </Link>
        </div>
      </div>
    );
  }

  // Responsive Grid Layout using .glass-card styling
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {wishes.map((w) => {
        const theme = CARD_THEMES.find((t) => t.id === w.theme) || CARD_THEMES[0];
        const catObj = WISH_CATEGORIES.find((c) => c.id === w.category);

        return (
          <article
            key={w.id}
            className="glass-card glass-card-hover flex flex-col justify-between relative overflow-hidden group"
          >
            {/* Top theme ambient glow line */}
            <div
              className="absolute top-0 left-0 right-0 h-1 opacity-70 transition-opacity group-hover:opacity-100"
              style={{ backgroundColor: theme.ornamentColor }}
            />

            <div>
              {/* Category & Timestamp Metadata */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: theme.ornamentColor }}
                  />
                  <span className="font-medium text-slate-300">
                    {catObj ? catObj.label : "Holiday Wish"}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-slate-500">
                  {formatWishTime(w.createdAt || w.timestamp)}
                </span>
              </div>

              {/* Message */}
              <blockquote className="font-display text-base sm:text-lg text-slate-100 italic leading-relaxed mb-6 font-normal">
                "{w.message}"
              </blockquote>
            </div>

            {/* Footer with author & action controls */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Penned by</div>
                  <div className="text-sm font-semibold text-white truncate max-w-[150px] sm:max-w-[180px]">
                    {w.name || "Anonymous Friend"}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleDownload(w)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-amber-300 transition-colors"
                    title="Download Card (PNG)"
                    aria-label="Download Card"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShare(w)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    title="Copy wish text"
                    aria-label="Share wish"
                  >
                    {copiedId === w.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Interactive Reactions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onReact && onReact(w.id, "warmth")}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-white/5 text-xs transition-colors"
                  title="Send Warmth"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
                  <span className="font-mono text-[11px] tabular-nums font-semibold">
                    {w.reactions?.warmth || 0}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onReact && onReact(w.id, "star")}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-white/5 text-xs transition-colors"
                  title="Light a Star"
                >
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                  <span className="font-mono text-[11px] tabular-nums font-semibold">
                    {w.reactions?.star || 0}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onReact && onReact(w.id, "cheer")}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/5 text-xs transition-colors"
                  title="Festive Cheer"
                >
                  <span className="text-xs">🎄</span>
                  <span className="font-mono text-[11px] tabular-nums font-semibold">
                    {w.reactions?.cheer || 0}
                  </span>
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
