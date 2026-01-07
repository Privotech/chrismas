import { useEffect, useState } from "react";

export default function Snowfall({ count = 20 }) {
  const [flakes, setFlakes] = useState([]);

  useEffect(() => {
    const arr = Array.from({ length: count }).map((_, i) => {
      const left = Math.random() * 100;
      const size = 8 + Math.random() * 28;
      const delay = Math.random() * -20;
      const duration = 8 + Math.random() * 12;
      return { id: i, left, size, delay, duration };
    });
    setFlakes(arr);
  }, [count]);

  return (
    <div className="snowfall" aria-hidden>
      {flakes.map((f) => (
        <svg
          key={f.id}
          className="snowflake sway"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            zIndex: 40,
            position: "absolute",
          }}
        >
          <circle cx="12" cy="12" r="6" fill="white" opacity="0.95" />
        </svg>
      ))}
    </div>
  );
}
