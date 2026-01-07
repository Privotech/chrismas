import { useEffect, useState } from "react";

export default function WishOthers() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/wishes");
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        if (mounted) {
          setWishes(data);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  return (
    <section className="card max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Wishes from Others</h2>
      {loading && <p className="text-slate-300">Loading wishes...</p>}
      {error && <p className="text-red-300">Error: {error}</p>}
      {!loading && !error && (
        <ul className="space-y-3 mt-4 text-left">
          {wishes.length === 0 && (
            <li className="text-slate-300">No wishes yet — be the first!</li>
          )}
          {wishes.map((w, i) => (
            <li
              key={i}
              className="bg-slate-900/40 border border-slate-700 p-3 rounded"
            >
              <div className="text-sm text-slate-400">
                {new Date(w.createdAt).toLocaleString()}
              </div>
              <div className="mt-1">
                <strong className="text-white">{w.name || "Anonymous"}</strong>
              </div>
              <div className="mt-2 text-slate-200">{w.message}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
