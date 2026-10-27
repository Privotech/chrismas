import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Volume2, VolumeX, Snowflake, Plus, Menu, X, Music } from "lucide-react";
import { holidayAudio } from "../utils/holidayAudio";

export default function Header({ snowDensity, onToggleSnow }) {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioMenuOpen, setAudioMenuOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState("chimes");

  function handleAudioToggle() {
    holidayAudio.toggleMusic((active) => {
      setIsAudioPlaying(active);
    });
  }

  function handleSelectTrack(trackKey) {
    setCurrentTrack(trackKey);
    holidayAudio.setTrack(trackKey);
    if (!isAudioPlaying) {
      holidayAudio.toggleMusic((active) => {
        setIsAudioPlaying(active);
      });
    }
    setAudioMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#06110e]/90 border-b border-emerald-950/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2.5 text-white hover:opacity-95 transition-opacity whitespace-nowrap shrink-0 group"
        >
          <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-crimson-600 via-rose-500 to-amber-400 flex items-center justify-center text-sm shadow-md shadow-crimson-900/50">
            ✨
          </span>
          <span className="font-display text-xl font-bold tracking-tight bg-gradient-to-r from-white via-amber-100 to-amber-200 bg-clip-text text-transparent">
            Christmas Wishes 2026
          </span>
        </Link>

        {/* Zone 2: Navigation Links (Desktop) */}
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
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Audio Chimes Ambience + Track Selector */}
          <div className="relative">
            <div className="flex items-center bg-white/5 rounded-lg border border-white/10 p-0.5">
              <button
                type="button"
                onClick={handleAudioToggle}
                aria-label={isAudioPlaying ? "Mute holiday chimes" : "Play gentle holiday chimes"}
                title={isAudioPlaying ? "Mute festive chimes" : "Play festive ambient chimes"}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                  isAudioPlaying
                    ? "bg-amber-500/20 text-amber-300"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {isAudioPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => setAudioMenuOpen(!audioMenuOpen)}
                className="p-1.5 text-slate-400 hover:text-slate-200 text-xs"
                title="Select Holiday Melody"
              >
                <Music className="w-3.5 h-3.5" />
              </button>
            </div>

            {audioMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-emerald-800/80 rounded-xl p-2 shadow-2xl z-50 text-xs space-y-1">
                <div className="px-2 py-1 text-[10px] uppercase font-semibold text-amber-300/80">
                  Holiday Melodies
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectTrack("silent_night")}
                  className={`w-full text-left px-2 py-1.5 rounded-lg transition-colors ${
                    currentTrack === "silent_night" ? "bg-amber-500/20 text-amber-200 font-semibold" : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  🔔 Silent Night
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectTrack("jingle_bells")}
                  className={`w-full text-left px-2 py-1.5 rounded-lg transition-colors ${
                    currentTrack === "jingle_bells" ? "bg-amber-500/20 text-amber-200 font-semibold" : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  🎄 Jingle Bells
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectTrack("chimes")}
                  className={`w-full text-left px-2 py-1.5 rounded-lg transition-colors ${
                    currentTrack === "chimes" ? "bg-amber-500/20 text-amber-200 font-semibold" : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  ✨ Ambient Chimes
                </button>
              </div>
            )}
          </div>

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
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 rounded-lg shadow-lg shadow-crimson-900/30 transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Make a Wish</span>
            <span className="sm:hidden">Wish</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white border border-white/10"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-950 bg-[#06110e]/95 px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-amber-500/20 text-amber-300 font-semibold" : "text-slate-300 hover:bg-white/5"
              }`
            }
          >
            Sanctuary Home
          </NavLink>
          <NavLink
            to="/wish-others"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-amber-500/20 text-amber-300 font-semibold" : "text-slate-300 hover:bg-white/5"
              }`
            }
          >
            Community Wall
          </NavLink>
          <NavLink
            to="/tree"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-amber-500/20 text-amber-300 font-semibold" : "text-slate-300 hover:bg-white/5"
              }`
            }
          >
            Virtual Tree
          </NavLink>
          <NavLink
            to="/make"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-crimson-600 to-crimson-700"
          >
            Make a Wish
          </NavLink>
        </div>
      )}
    </header>
  );
}
