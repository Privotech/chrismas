import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Plus, Gift, Sparkle } from "lucide-react";
import { getChristmasCountdown, fireHolidayConfetti } from "../utils/holidayUtils";
import { holidayAudio } from "../utils/holidayAudio";
import WishesGrid from "./WishesGrid";

const DAILY_BLESSINGS = [
  {
    theme: "Kindness in Winter",
    message: "Reach out to someone who might be celebrating alone this year. A two-minute message can light up their entire holiday season.",
    tag: "Day of Warmth",
  },
  {
    theme: "Quiet Gratitude",
    message: "Take ten peaceful minutes tonight by candlelight to thank yourself for the courage and quiet resilience you showed throughout 2026.",
    tag: "Day of Peace",
  },
  {
    theme: "The Magic of Giving",
    message: "Secretly do something kind today—leave a holiday note, tip extra generously, or pay for someone's hot cocoa behind you.",
    tag: "Day of Cheer",
  },
  {
    theme: "Forgiveness & Renewal",
    message: "Let go of an old grudge or unspoken hurt. Make space in your heart for the joy and fresh beginnings arriving in 2027.",
    tag: "Day of Hope",
  },
];

export default function Home() {
  const [countdown, setCountdown] = useState(getChristmasCountdown());
  const [recentWishes, setRecentWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [giftOpened, setGiftOpened] = useState(false);
  const [blessingIndex, setBlessingIndex] = useState(0);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getChristmasCountdown());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch recent wishes
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
          setRecentWishes(items.slice(0, 3));
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

  function handleReact(wishId, key) {
    holidayAudio.playSparkle();
    setRecentWishes((prev) =>
      prev.map((w) => {
        if (w.id === wishId) {
          const current = w.reactions || { warmth: 0, cheer: 0, star: 0, hug: 0 };
          return {
            ...w,
            reactions: {
              ...current,
              [key]: (current[key] || 0) + 1,
            },
          };
        }
        return w;
      })
    );
    try {
      fetch(`/api/wishes/${wishId}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reaction: key }),
      });
    } catch {
      // ignore
    }
  }

  function handleOpenGift() {
    setGiftOpened(true);
    setBlessingIndex((prev) => (prev + 1) % DAILY_BLESSINGS.length);
    holidayAudio.playSparkle();
    fireHolidayConfetti();
  }

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden border border-emerald-900/60 shadow-2xl bg-slate-950">
        <div className="relative min-h-[460px] md:min-h-[540px] flex flex-col justify-end p-6 sm:p-10 md:p-14">
          {/* Hero background image */}
          <img
            src="/src/assets/images/hero_christmas_2026_1793033830678.jpg"
            alt="Christmas 2026 celebration by the fireplace"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90"
            referrerPolicy="no-referrer"
          />

          {/* Measured gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#04120e] via-[#04120e]/75 to-black/30" />

          {/* Content */}
          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300 bg-amber-950/80 border border-amber-700/60 px-3.5 py-1 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Welcoming Christmas 2026</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1] text-balance">
              Where Heartfelt Holiday Wishes Take Flight
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl text-balance">
              Share a message of warmth, hang an ornament on our virtual tree, or read peaceful greetings from neighbors across the globe.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to="/make"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-crimson-600 via-rose-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 text-white font-semibold text-sm rounded-xl shadow-xl shadow-crimson-950/60 transition-transform hover:-translate-y-0.5 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Make a Christmas Wish</span>
              </Link>
              <Link
                to="/wish-others"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-sm rounded-xl backdrop-blur-md transition-colors whitespace-nowrap"
              >
                <span>Read Community Wishes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/tree"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-900/60 hover:bg-emerald-800/60 border border-emerald-700/50 text-emerald-200 font-medium text-sm rounded-xl transition-colors whitespace-nowrap"
              >
                <span>Visit Virtual Tree</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Strip */}
      <section className="glass-card bg-gradient-to-r from-[#061e16] via-[#09261c] to-[#061e16] border-emerald-800/40 p-8 sm:p-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wider font-semibold text-amber-300">
              December 25, 2026
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Counting Down to Christmas
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Days of anticipation, kindness, and festive light.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:gap-6">
            <div className="flex flex-col items-center bg-black/40 border border-white/10 rounded-2xl px-4 py-3 min-w-[72px] sm:min-w-[84px]">
              <span className="font-mono text-2xl sm:text-4xl font-bold text-amber-300 tabular-nums">
                {String(countdown.days).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mt-1">Days</span>
            </div>
            <div className="flex flex-col items-center bg-black/40 border border-white/10 rounded-2xl px-4 py-3 min-w-[72px] sm:min-w-[84px]">
              <span className="font-mono text-2xl sm:text-4xl font-bold text-amber-300 tabular-nums">
                {String(countdown.hours).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mt-1">Hours</span>
            </div>
            <div className="flex flex-col items-center bg-black/40 border border-white/10 rounded-2xl px-4 py-3 min-w-[72px] sm:min-w-[84px]">
              <span className="font-mono text-2xl sm:text-4xl font-bold text-amber-300 tabular-nums">
                {String(countdown.minutes).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mt-1">Mins</span>
            </div>
            <div className="flex flex-col items-center bg-black/40 border border-white/10 rounded-2xl px-4 py-3 min-w-[72px] sm:min-w-[84px]">
              <span className="font-mono text-2xl sm:text-4xl font-bold text-amber-300 tabular-nums">
                {String(countdown.seconds).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mt-1">Secs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Holiday Gift of Kindness */}
      <section className="glass-card bg-gradient-to-br from-[#1d1204] via-[#0d1f18] to-[#1a080c] border-amber-600/30 p-8 sm:p-10 relative overflow-hidden">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          {/* Animated Present Icon */}
          <button
            type="button"
            onClick={handleOpenGift}
            className="group relative p-6 rounded-3xl bg-amber-500/10 border border-amber-400/40 hover:bg-amber-500/20 hover:scale-105 transition-all duration-300 cursor-pointer shadow-xl shadow-amber-950/40"
            title="Click to unwrap today's holiday blessing"
          >
            <div className="text-5xl group-hover:rotate-12 transition-transform duration-300">
              🎁
            </div>
            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full whitespace-nowrap shadow">
              {giftOpened ? "Unwrap Next" : "Tap to Open"}
            </span>
          </button>

          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300">
              <Gift className="w-3.5 h-3.5" />
              <span>Daily Holiday Gift of Kindness</span>
            </div>

            {giftOpened ? (
              <div className="space-y-2 animate-in fade-in zoom-in-95 duration-300">
                <span className="text-xs font-mono text-emerald-400 font-medium">
                  {DAILY_BLESSINGS[blessingIndex].tag}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  "{DAILY_BLESSINGS[blessingIndex].theme}"
                </h3>
                <p className="text-sm text-slate-200 italic leading-relaxed bg-black/30 p-4 rounded-xl border border-white/5">
                  {DAILY_BLESSINGS[blessingIndex].message}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  A Gentle Winter Blessing Awaits
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Unwrap a daily inspirational thought, quiet challenge, or festive reminder crafted to bring peace to your day.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleOpenGift}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 underline cursor-pointer"
                  >
                    <Sparkle className="w-3 h-3" />
                    <span>Unwrap Today's Blessing</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bento Grid: 2026 Modern Features */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Celebrate the 2026 Holiday Season
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Three simple ways to kindle warmth and spread joy this December.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Virtual Tree */}
          <Link
            to="/tree"
            className="group glass-card glass-card-hover overflow-hidden flex flex-col justify-between border-emerald-900/60 p-0"
          >
            <div className="h-48 overflow-hidden relative">
              <img
                src="/src/assets/images/festive_tree_ornament_1793033831580.jpg"
                alt="Artisanal glass Christmas tree ornament"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            </div>
            <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  01. Interactive Tree
                </div>
                <h3 className="font-display text-xl font-bold text-white mt-1 group-hover:text-amber-200 transition-colors">
                  The Community Tree
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Every wish turns into an artisanal glowing ornament. Light the top star and watch the branches glow.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs text-amber-300 font-medium">
                <span>Explore the Tree</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card 2: Wish Workshop */}
          <Link
            to="/make"
            className="group glass-card glass-card-hover overflow-hidden flex flex-col justify-between border-rose-900/60 p-0"
          >
            <div className="h-48 overflow-hidden relative">
              <img
                src="/src/assets/images/cozy_holiday_gathering_1793033831920.jpg"
                alt="Cozy holiday cards and tabletop candles"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            </div>
            <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                  02. Wish Workshop
                </div>
                <h3 className="font-display text-xl font-bold text-white mt-1 group-hover:text-amber-200 transition-colors">
                  Craft a Keepsake Card
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Choose from four curated holiday themes with live card previews and prompt inspiration.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs text-rose-300 font-medium">
                <span>Pen Your Wish</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card 3: Community Wall */}
          <Link
            to="/wish-others"
            className="group glass-card glass-card-hover flex flex-col justify-between border-amber-900/60 p-6 bg-gradient-to-br from-[#1c1303] to-[#0f0902]"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
                <Heart className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  03. Global Wall
                </div>
                <h3 className="font-display text-xl font-bold text-white group-hover:text-amber-200 transition-colors">
                  Send Heartfelt Warmth
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Browse by category, react with stars and hugs, and share comforting messages with families worldwide.
                </p>
              </div>
            </div>

            <div className="pt-8 flex items-center gap-1.5 text-xs text-amber-300 font-medium">
              <span>View Community Wall</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Recent Wishes Showcase using .glass-card WishesGrid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">Recent Holiday Wishes</h2>
            <p className="text-xs text-slate-400 mt-0.5">Recently hung on our 2026 tree</p>
          </div>
          <Link
            to="/wish-others"
            className="text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <WishesGrid
          wishes={recentWishes}
          loading={loading}
          onReact={handleReact}
        />
      </section>
    </div>
  );
}
