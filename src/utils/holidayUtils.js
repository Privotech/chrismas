import confetti from "canvas-confetti";

export const CHRISTMAS_2026_TARGET = new Date("2026-12-25T00:00:00.000Z");

export function getChristmasCountdown() {
  const now = new Date();
  const diff = CHRISTMAS_2026_TARGET.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isChristmas: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isChristmas: false };
}

export const WISH_CATEGORIES = [
  { id: "all", label: "All Wishes", icon: "Sparkles" },
  { id: "family", label: "Family & Loved Ones", icon: "Heart" },
  { id: "peace", label: "Peace & Hope", icon: "Dove" },
  { id: "gratitude", label: "Holiday Gratitude", icon: "Gift" },
  { id: "dreams", label: "2027 Dreams", icon: "Star" },
];

export const CARD_THEMES = [
  {
    id: "pine",
    name: "Midnight Pine",
    bgClass: "from-[#082017] to-[#04130d] border-emerald-500/30",
    accentClass: "text-emerald-400",
    badgeBg: "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60",
    ornamentColor: "#10b981",
  },
  {
    id: "crimson",
    name: "Crimson Velvet",
    bgClass: "from-[#2b080c] to-[#150406] border-rose-500/30",
    accentClass: "text-rose-400",
    badgeBg: "bg-rose-950/80 text-rose-300 border border-rose-800/60",
    ornamentColor: "#f43f5e",
  },
  {
    id: "gold",
    name: "Golden Noel",
    bgClass: "from-[#221805] to-[#130d02] border-amber-500/30",
    accentClass: "text-amber-400",
    badgeBg: "bg-amber-950/80 text-amber-300 border border-amber-800/60",
    ornamentColor: "#fbbf24",
  },
  {
    id: "starlight",
    name: "Winter Starlight",
    bgClass: "from-[#0a1628] to-[#050c17] border-cyan-500/30",
    accentClass: "text-cyan-300",
    badgeBg: "bg-sky-950/80 text-sky-300 border border-sky-800/60",
    ornamentColor: "#38bdf8",
  },
];

export const FESTIVE_PROMPTS = [
  "May peace, good health, and gentle snowfall find your doorstep this Christmas 2026.",
  "Wishing warmth to the ones who held my hand through every storm this year.",
  "Here is to midnight carols, hot spiced cider, and memories we'll cherish forever.",
  "For those celebrating alone or across oceans: you are held in warm hearts tonight.",
  "May 2027 bring courage to open new doors and peace with what we let go.",
  "Thankful for quiet mornings, loved ones near, and the warmth of a shared meal.",
];

export function fireHolidayConfetti() {
  try {
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.75 },
      colors: ["#d4af37", "#e63946", "#ffffff", "#10b981"],
      shapes: ["circle", "star"],
      scalar: 1.1,
    });
  } catch {
    // fallback
  }
}

export function formatWishTime(dateStr) {
  if (!dateStr) return "Recently";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Recently";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
