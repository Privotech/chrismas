import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import Snowfall from "./Snowfall";

export default function Layout() {
  const [snowDensity, setSnowDensity] = useState("gentle");

  function handleToggleSnow() {
    setSnowDensity((prev) => {
      if (prev === "gentle") return "blizzard";
      if (prev === "blizzard") return "paused";
      return "gentle";
    });
  }

  return (
    <div className="min-h-screen flex flex-col relative text-slate-100 overflow-x-hidden">
      <Snowfall density={snowDensity} />
      <Header snowDensity={snowDensity} onToggleSnow={handleToggleSnow} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
