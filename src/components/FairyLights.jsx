import { useState } from "react";

export default function FairyLights() {
  const [lightsActive, setLightsActive] = useState(true);

  if (!lightsActive) {
    return (
      <div className="w-full flex justify-end px-4 py-1">
        <button
          type="button"
          onClick={() => setLightsActive(true)}
          className="text-[11px] text-amber-300/60 hover:text-amber-200 transition-colors"
        >
          ✨ Show Holiday Lights
        </button>
      </div>
    );
  }

  // 24 bulbs across width
  const bulbColors = [
    { bg: "bg-red-500", glow: "shadow-[0_0_12px_3px_rgba(239,68,68,0.7)]" },
    { bg: "bg-amber-400", glow: "shadow-[0_0_12px_3px_rgba(251,191,36,0.7)]" },
    { bg: "bg-emerald-400", glow: "shadow-[0_0_12px_3px_rgba(52,211,153,0.7)]" },
    { bg: "bg-sky-400", glow: "shadow-[0_0_12px_3px_rgba(56,189,248,0.7)]" },
    { bg: "bg-rose-400", glow: "shadow-[0_0_12px_3px_rgba(251,113,133,0.7)]" },
    { bg: "bg-yellow-300", glow: "shadow-[0_0_12px_3px_rgba(253,224,71,0.7)]" },
  ];

  return (
    <div className="relative w-full overflow-hidden select-none py-1 border-b border-white/5 bg-black/20">
      {/* Wire */}
      <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-emerald-950/80 -translate-y-1/2 pointer-events-none" />

      {/* Bulbs */}
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4">
        {Array.from({ length: 24 }).map((_, i) => {
          const color = bulbColors[i % bulbColors.length];
          const animDelay = (i * 0.18) % 1.5;
          return (
            <div key={i} className="flex flex-col items-center">
              {/* Socket */}
              <div className="w-1.5 h-1 bg-emerald-900 rounded-t-sm" />
              {/* Bulb */}
              <div
                className={`w-2.5 h-3.5 sm:w-3 sm:h-4 rounded-full ${color.bg} ${color.glow} transition-all duration-700 animate-pulse`}
                style={{
                  animationDelay: `${animDelay}s`,
                  animationDuration: `${1.4 + (i % 3) * 0.4}s`,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
