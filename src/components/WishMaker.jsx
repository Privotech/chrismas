import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Send, CheckCircle2, Wand2, ArrowRight, Download } from "lucide-react";
import { WISH_CATEGORIES, CARD_THEMES, FESTIVE_PROMPTS, fireHolidayConfetti, formatWishTime } from "../utils/holidayUtils";
import { holidayAudio } from "../utils/holidayAudio";
import { downloadHolidayCard } from "../utils/cardExporter";

export default function WishMaker() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("family");
  const [themeId, setThemeId] = useState("pine");
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [createdWish, setCreatedWish] = useState(null);

  const selectedTheme = CARD_THEMES.find((t) => t.id === themeId) || CARD_THEMES[0];

  function handleRandomPrompt() {
    const randomIdx = Math.floor(Math.random() * FESTIVE_PROMPTS.length);
    setMessage(FESTIVE_PROMPTS[randomIdx]);
    holidayAudio.playSparkle();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus("sending");
    try {
      const now = new Date().toISOString();
      const newWish = {
        id: "wish-" + Date.now(),
        name: name.trim() || "Anonymous Friend",
        message: message.trim(),
        category,
        theme: themeId,
        createdAt: now,
        timestamp: now,
        reactions: {
          warmth: 1,
          cheer: 1,
          star: 1,
          hug: 0,
        },
      };

      // 1. Sync to localStorage
      try {
        const local = JSON.parse(localStorage.getItem("wishes") || "[]");
        local.unshift(newWish);
        localStorage.setItem("wishes", JSON.stringify(local));
      } catch {
        // Ignore localStorage quota
      }

      // 2. Post to API
      try {
        const res = await fetch("/api/wishes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newWish),
        });
        if (res.ok) {
          const saved = await res.json();
          setCreatedWish(saved);
        } else {
          setCreatedWish(newWish);
        }
      } catch {
        setCreatedWish(newWish);
      }

      // Celebration effects
      holidayAudio.playSparkle();
      fireHolidayConfetti();

      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  function handleReset() {
    setName("");
    setMessage("");
    setStatus("idle");
    setCreatedWish(null);
  }

  function handleDownloadCurrent() {
    const wishData = createdWish || {
      name: name.trim() || "Anonymous Friend",
      message: message.trim() || "May your Christmas 2026 be wrapped in love, laughter, and holiday warmth.",
      category,
      theme: themeId,
    };
    downloadHolidayCard(wishData);
    holidayAudio.playSparkle();
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300 bg-amber-950/60 border border-amber-800/60 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Christmas 2026 Wish Workshop</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
          Make a Christmas Wish
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          Pen a heartfelt holiday message to warm hearts across our global community. Choose your festive card style and download as a digital keepsake card.
        </p>
      </div>

      {status === "success" && (
        <div className="glass-card bg-gradient-to-b from-[#0a2318] to-[#04140e] border-emerald-500/40 text-center py-12 px-6 space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Your Wish is Shining Bright!
            </h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Thank you, {createdWish?.name || "Friend"}. Your wish has been hung on the 2026 Virtual Tree and placed onto the Community Wall.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={handleDownloadCurrent}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-semibold text-sm rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Holiday Card (PNG)</span>
            </button>
            <Link
              to="/wish-others"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 text-white font-medium text-sm rounded-xl shadow-lg transition-transform hover:-translate-y-0.5"
            >
              <span>Explore Community Wall</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/tree"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800/40 hover:bg-emerald-700/40 border border-emerald-700/60 text-emerald-200 font-medium text-sm rounded-xl transition-colors"
            >
              <span>See on Virtual Tree</span>
            </Link>
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium rounded-xl transition-colors"
            >
              Make Another Wish
            </button>
          </div>
        </div>
      )}

      {status !== "success" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Wish Form (7 cols) */}
          <div className="lg:col-span-7 glass-card space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="wish-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Your Name or Family Title (Optional)
                </label>
                <input
                  id="wish-name"
                  type="text"
                  maxLength={50}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors text-sm"
                  placeholder="e.g., The Miller Family, Santa's Helper, or Maya"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Wish Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {WISH_CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all text-center border ${
                        category === cat.id
                          ? "bg-amber-500/20 text-amber-200 border-amber-400 shadow-sm"
                          : "bg-black/30 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Holiday Card Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CARD_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setThemeId(theme.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                        themeId === theme.id
                          ? "bg-white/10 text-white border-amber-400 ring-1 ring-amber-400"
                          : "bg-black/30 text-slate-400 border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: theme.ornamentColor }}
                      />
                      <span className="truncate">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="wish-message" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Your Holiday Wish *
                  </label>
                  <button
                    type="button"
                    onClick={handleRandomPrompt}
                    className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 hover:underline transition-colors"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Inspire Me</span>
                  </button>
                </div>
                <textarea
                  id="wish-message"
                  required
                  rows={4}
                  maxLength={400}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors text-sm leading-relaxed resize-none"
                  placeholder="Share warmth, love, peace, or festive cheer..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="text-right text-[11px] text-slate-500 mt-1">
                  {message.length} / 400 characters
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === "sending" || !message.trim()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-crimson-600 via-rose-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-xl shadow-crimson-950/50 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>{status === "sending" ? "Hanging Wish on the Tree…" : "Send Christmas 2026 Wish"}</span>
                </button>
                {status === "error" && (
                  <p className="text-xs text-rose-400 text-center mt-2">
                    Failed to send wish. Please check your connection and try again.
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Live Card Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Real-Time Holiday Card Preview</span>
              </span>
              <button
                type="button"
                onClick={handleDownloadCurrent}
                className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-medium capitalize"
                title="Download this preview as card"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Card</span>
              </button>
            </div>

            <div
              className={`rounded-2xl border p-6 sm:p-7 shadow-2xl bg-gradient-to-br ${selectedTheme.bgClass} relative overflow-hidden transition-all duration-500`}
            >
              {/* Decorative Corner Filigree */}
              <div className="absolute top-3 right-3 text-2xl opacity-40 select-none">
                🎄
              </div>
              <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-white/5 rounded-full blur-xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${selectedTheme.badgeBg}`}>
                    {WISH_CATEGORIES.find((c) => c.id === category)?.label || "Christmas Wish"}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {formatWishTime(new Date())}
                  </span>
                </div>

                <div className="min-h-[100px] flex items-center">
                  <p className="font-display text-base sm:text-lg text-slate-100 italic leading-relaxed">
                    {message.trim() ? `"${message}"` : '"May your Christmas 2026 be wrapped in love, laughter, and holiday warmth."'}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 font-medium">With warm blessings,</div>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      {name.trim() || "Anonymous Friend"}
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-amber-950 flex items-center justify-center text-xs font-bold shadow-md">
                    2026
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-400 space-y-1">
              <div className="font-medium text-slate-300">Holiday Card Guarantee:</div>
              <p>Your wish will be preserved on the public community wall and pinned to the 2026 Virtual Tree for friends to view and heart.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
