import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const wishes = JSON.parse(localStorage.getItem("wishes") || "[]");
        if (mounted) {
          setRecent(wishes.slice(-4).reverse());
          setLoading(false);
        }
      } catch (err) {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="card text-white py-24 bg-gradient-to-r from-red-700 via-rose-600 to-red-700 relative">
        <div className="absolute inset-0 bg-black/40 rounded-2xl pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="text-4xl font-extrabold mt-4">
            Christmas Community Wishes
          </h1>
          <p className="mt-3 text-lg opacity-90">
            Write a heartfelt wish and brighten someone's day.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/make"
              className="inline-block px-6 py-3 rounded bg-white text-red-700 font-semibold"
            >
              Make a Wish
            </Link>
            <Link
              to="/wish-others"
              className="inline-block px-6 py-3 rounded bg-white/10 border border-white/20 text-white"
            >
              See Wishes
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6 text-center">
          <div className="text-3xl">✉️</div>
          <h3 className="mt-3 font-semibold">Send a Wish</h3>
          <p className="mt-2 text-sm text-slate-300">
            Write your message and send it to the community.
          </p>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl">🤝</div>
          <h3 className="mt-3 font-semibold">Share Joy</h3>
          <p className="mt-2 text-sm text-slate-300">
            Read and react to wishes from others.
          </p>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl">🌟</div>
          <h3 className="mt-3 font-semibold">Celebrate</h3>
          <p className="mt-2 text-sm text-slate-300">
            Spread kindness and festive cheer.
          </p>
        </div>
      </section>

      {/* Recent wishes preview */}
      <section className="container">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recent Wishes</h2>
          <Link to="/wish-others" className="text-sm text-slate-300">
            View all
          </Link>
        </div>

        <div className="grid gap-3">
          {loading && <div className="text-slate-300">Loading...</div>}
          {!loading && recent.length === 0 && (
            <div className="card p-4 text-center text-slate-300">
              No wishes yet — be the first to make one!
            </div>
          )}

          {!loading &&
            recent.map((w, i) => (
              <article key={i} className="card p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center">
                    🎁
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-slate-400">
                      {new Date(w.createdAt).toLocaleString()}
                    </div>
                    <div className="mt-1">
                      <strong className="text-white">
                        {w.name || "Anonymous"}
                      </strong>
                    </div>
                    <p className="mt-2 text-slate-200">{w.message}</p>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container">
        <h3 className="text-xl font-semibold mb-3">How it works</h3>
        <ol className="grid md:grid-cols-3 gap-4">
          <li className="card p-4">
            <div className="font-bold">1. Make a wish</div>
            <div className="text-sm text-slate-300 mt-2">
              Tell us your wish — it can be big or small.
            </div>
          </li>
          <li className="card p-4">
            <div className="font-bold">2. Share</div>
            <div className="text-sm text-slate-300 mt-2">
              Your wish appears for others to read and enjoy.
            </div>
          </li>
          <li className="card p-4">
            <div className="font-bold">3. Celebrate</div>
            <div className="text-sm text-slate-300 mt-2">
              Spread joy and kindness this season.
            </div>
          </li>
        </ol>
      </section>

      <section className="container text-center py-6">
      </section>
    </div>
  );
}

