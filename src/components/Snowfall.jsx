import { useMemo } from "react";

function getSeededRandom(seed) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export default function Snowfall({ density = "gentle" }) {
  const count = density === "blizzard" ? 40 : density === "gentle" ? 22 : 0;

  const flakes = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const left = getSeededRandom(i * 5 + 1) * 100;
      const size = 3 + getSeededRandom(i * 5 + 2) * 5; // 3px to 8px soft crystalline flakes
      const opacity = 0.35 + getSeededRandom(i * 5 + 3) * 0.55;
      const delay = getSeededRandom(i * 5 + 4) * -25;
      const duration = 9 + getSeededRandom(i * 5 + 5) * 12;
      return { id: i, left, size, opacity, delay, duration };
    });
  }, [count]);

  if (count === 0) return null;

  return (
    <div className="snowfall-layer" aria-hidden="true">
      {flakes.map((f) => (
        <div
          key={f.id}
          className="snowflake-item"
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            opacity: f.opacity,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            borderRadius: "50%",
            backgroundColor: "white",
            boxShadow: "0 0 6px 1px rgba(255, 255, 255, 0.4)",
          }}
        />
      ))}
    </div>
  );
}
