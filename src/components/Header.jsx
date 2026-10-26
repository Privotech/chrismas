import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Volume2, VolumeX, Snowflake, Plus } from "lucide-react";
import { holidayAudio } from "../utils/holidayAudio";

export default function Header({ snowDensity, onToggleSnow }) {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  function handleAudioToggle() {
    holidayAudio.toggleMusic((active) => {
      setIsAudioPlaying(active);
    });
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#06110e]/85 border-b border-emerald-950/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-white hover:opacity-95 transition-opacity whitespace-nowrap shrink-0 group"
        >
          <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-crimson-600 via-rose-500 to-amber-400 flex items-center justify-center text-sm shadow-md shadow-crimson-900/50">
            ✨
          </span>
          <span className="font-display text-xl font-bold tracking-tight bg-gradient-to-r from-white via-amber-100 to-amber-200 bg-clip-text text-transparent">
            Christmas Wishes 2026
          </span>
        </Link>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 ${
                isActive ? "text-amber-300 font-semibold border-b-2 border-amber-400 pb-0.5" : ""
              }`
            }
          >
            Sanctuary
          </NavLink>
          <NavLink
            to="/wish-others"
            className={({ isActive }) =>
              `hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 ${
                isActive ? "text-amber-300 font-semibold border-b-2 border-amber-400 pb-0.5" : ""
              }`
            }
          >
            Community Wall
          </NavLink>
          <NavLink
            to="/tree"
            className={({ isActive }) =>
              `hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 ${
                isActive ? "text-amber-300 font-semibold border-b-2 border-amber-400 pb-0.5" : ""
              }`
            }
          >
            Virtual Tree
          </NavLink>
        </nav>

        {/* Zone 3: Controls & Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Audio Chimes Ambience */}
          <button
            type="button"
            onClick={handleAudioToggle}
            aria-label={isAudioPlaying ? "Mute holiday chimes" : "Play gentle holiday chimes"}
            title={isAudioPlaying ? "Mute festive chimes" : "Play festive ambient chimes"}
            className={`p-2 rounded-lg text-xs font-medium transition-colors border ${
              isAudioPlaying
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-white/5 text-slate-400 border-white/10 hover:text-slate-200"
            }`}
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Snowfall Toggle */}
          <button
            type="button"
            onClick={onToggleSnow}
            aria-label="Toggle snow density"
            title={`Snowfall: ${snowDensity}`}
            className={`p-2 rounded-lg text-xs font-medium transition-colors border ${
              snowDensity !== "paused"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-white/5 text-slate-400 border-white/10 hover:text-slate-200"
            }`}
          >
            <Snowflake className={`w-4 h-4 ${snowDensity !== "paused" ? "text-emerald-300" : ""}`} />
          </button>

          {/* Primary Action Button */}
          <Link
            to="/make"
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 rounded-lg shadow-lg shadow-crimson-900/30 transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Make a Wish</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
