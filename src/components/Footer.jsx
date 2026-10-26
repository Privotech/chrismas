import { Link } from "react-router-dom";
import { Heart, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-emerald-950/80 bg-[#040c0a]/95 text-slate-400 py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-white font-display text-lg font-bold">
              <span>Christmas Wishes 2026</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              A community holiday sanctuary uniting friends, families, and kindred spirits across the globe.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium">
            <Link to="/" className="hover:text-amber-300 transition-colors">
              Home
            </Link>
            <Link to="/make" className="hover:text-amber-300 transition-colors">
              Make a Wish
            </Link>
            <Link to="/wish-others" className="hover:text-amber-300 transition-colors">
              Community Wall
            </Link>
            <Link to="/tree" className="hover:text-amber-300 transition-colors">
              Virtual Tree
            </Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Christmas Wishes Community. Warmest holiday blessings.</p>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-crimson-500 fill-crimson-500" />
            <span>for Christmas 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
