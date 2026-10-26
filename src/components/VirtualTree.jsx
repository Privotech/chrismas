import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Heart, Star, Plus, X } from "lucide-react";
import { CARD_THEMES } from "../utils/holidayUtils";
import { holidayAudio } from "../utils/holidayAudio";

export default function VirtualTree() {
  const [wishes, setWishes] = useState([]);
  const [selectedWish, setSelectedWish] = useState(null);
  const [starLit, setStarLit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        let items = [];
        try {
          const res = await fetch("/api/wishes");
          if (res.ok) items = await res.json();
        } catch {
          // ignore
        }
        if (!items || items.length === 0) {
          items = JSON.parse(localStorage.getItem("wishes") || "[]");
        }
        if (mounted) {
          setWishes(items);
          setLoading(false);
        }
      } catch {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  function handleLightStar() {
    setStarLit(!starLit);
    holidayAudio.playSparkle();
  }

  // Generate ornament branch positions for wishes (up to 16 displayed on tree)
  const treeWishes = wishes.slice(0, 16);

  return (
    <div className="space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-300 bg-amber-950/60 border border-amber-800/60 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Holiday Wonder</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
          The 2026 Community Tree
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Each glowing ornament represents a wish from someone around the world. Click an ornament to read its heartfelt message, or light the treetop star.
        </p>
      </div>

      {/* Main Tree Canvas Area */}
      <div className="relative max-w-4xl mx-auto bg-gradient-to-b from-[#071d15] via-[#04140e] to-[#020b08] border border-emerald-900/60 rounded-3xl p-6 sm:p-12 overflow-hidden shadow-2xl">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Star on top */}
        <div className="flex flex-col items-center relative z-20 mb-8">
          <button
            type="button"
            onClick={handleLightStar}
            className={`transition-all duration-500 p-3 rounded-full cursor-pointer group ${
              starLit
                ? "bg-amber-400 text-amber-950 shadow-[0_0_50px_15px_rgba(251,191,36,0.7)] scale-110"
                : "bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:scale-105"
            }`}
            title="Click to light the holiday star"
          >
            <Star className={`w-10 h-10 ${starLit ? "fill-amber-950 animate-pulse" : "fill-amber-400/40"}`} />
          </button>
          <span className="text-xs font-medium text-amber-200/90 mt-2">
            {starLit ? "✨ Star of Hope is Shining!" : "Click Star to Illuminate"}
          </span>
        </div>

        {/* Tree Tier Silhouettes with Ornament Nodes */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          {loading ? (
            <div className="py-24 text-slate-400 text-sm">Gathering ornaments from the community...</div>
          ) : (
            <div className="w-full max-w-2xl space-y-8">
              {/* Tier 1 (Top) */}
              <div className="flex justify-center gap-6 sm:gap-10">
                {treeWishes.slice(0, 2).map((w, idx) => (
                  <OrnamentButton
                    key={w.id || idx}
                    wish={w}
                    onClick={() => setSelectedWish(w)}
                  />
                ))}
              </div>

              {/* Tier 2 */}
              <div className="flex justify-center gap-6 sm:gap-12">
                {treeWishes.slice(2, 5).map((w, idx) => (
                  <OrnamentButton
                    key={w.id || idx}
                    wish={w}
                    onClick={() => setSelectedWish(w)}
                  />
                ))}
              </div>

              {/* Tier 3 */}
              <div className="flex justify-center gap-4 sm:gap-10 flex-wrap">
                {treeWishes.slice(5, 10).map((w, idx) => (
                  <OrnamentButton
                    key={w.id || idx}
                    wish={w}
                    onClick={() => setSelectedWish(w)}
                  />
                ))}
              </div>

              {/* Tier 4 (Bottom branches) */}
              <div className="flex justify-center gap-4 sm:gap-8 flex-wrap">
                {treeWishes.slice(10, 16).map((w, idx) => (
                  <OrnamentButton
                    key={w.id || idx}
                    wish={w}
                    onClick={() => setSelectedWish(w)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tree Base / Presents */}
          <div className="pt-8 flex flex-col items-center border-t border-emerald-900/40 w-full mt-6">
            <div className="w-16 h-12 bg-amber-950/60 border border-amber-900/80 rounded-b-lg mb-4" />
            <div className="flex items-center gap-3">
              <Link
                to="/make"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 text-white font-medium text-sm rounded-xl shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span>Hang Your Wish on the Tree</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Wish Modal / Popover */}
      {selectedWish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-[#0b241b] to-[#04120d] border border-emerald-600/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-left">
            <button
              type="button"
              onClick={() => setSelectedWish(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Christmas Tree Ornament</span>
            </div>

            <h3 className="font-display text-2xl font-bold text-white mb-1">
              {selectedWish.name || "Anonymous Friend"}
            </h3>
            <p className="text-xs text-emerald-400 mb-4">
              Category: {selectedWish.category || "General Wish"}
            </p>

            <blockquote className="text-base sm:text-lg text-slate-200 italic leading-relaxed bg-black/30 p-4 rounded-xl border border-white/5">
              "{selectedWish.message}"
            </blockquote>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-emerald-900/50">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  {selectedWish.reactions?.warmth || 1} Warmth
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  {selectedWish.reactions?.star || 1} Stars
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWish(null)}
                className="px-4 py-2 bg-emerald-800/40 hover:bg-emerald-700/40 text-emerald-200 text-xs font-medium rounded-lg transition-colors border border-emerald-700/50"
              >
                Close Ornament
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrnamentButton({ wish, onClick }) {
  const theme = CARD_THEMES.find((t) => t.id === wish.theme) || CARD_THEMES[0];

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col items-center transition-all duration-300 hover:scale-110 cursor-pointer focus:outline-none"
      title={`${wish.name || "Friend"}: ${wish.message}`}
    >
      {/* Ornament thread */}
      <div className="w-0.5 h-4 bg-amber-300/40" />

      {/* Ornament bulb */}
      <div
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/30 flex items-center justify-center shadow-lg relative group-hover:shadow-[0_0_20px_5px_rgba(255,255,255,0.3)] transition-all"
        style={{
          background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${theme.ornamentColor} 60%, #000000 100%)`,
        }}
      >
        <span className="text-xs sm:text-sm drop-shadow">✨</span>
      </div>

      <span className="text-[11px] font-medium text-slate-300 max-w-[80px] truncate mt-1.5 group-hover:text-amber-200">
        {wish.name || "Friend"}
      </span>
    </button>
  );
}
