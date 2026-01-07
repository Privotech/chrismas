import { useState } from "react";

export default function WishMaker() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const wishes = JSON.parse(localStorage.getItem("wishes") || "[]");
      wishes.push({
        name: name || "Anonymous",
        message,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("wishes", JSON.stringify(wishes));
      setName("");
      setMessage("");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <section className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Make a Christmas Wish</h2>
      <p className="text-sm mb-4 opacity-90">
        Write your wish and share it with the community.
      </p>

      <form onSubmit={submit} className="grid gap-3">
        <input
          className="px-4 py-2 rounded bg-slate-900 border border-slate-700"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
        />

        <textarea
          className="px-4 py-3 rounded bg-slate-900 border border-slate-700 resize-none min-h-[120px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your Christmas wish here"
        />

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-christmas-500 hover:bg-christmas-700 text-white px-4 py-2 rounded font-medium"
          >
            Send Wish
          </button>
          {status === "sending" && (
            <span className="text-sm text-slate-300">Sending…</span>
          )}
          {status === "sent" && (
            <span className="text-sm text-green-300">
              Wish sent — thank you!
            </span>
          )}
          {status === "error" && (
            <span className="text-sm text-red-300">
              Failed to send. Try again.
            </span>
          )}
        </div>
      </form>
    </section>
  );
}
