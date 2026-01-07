import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import Snowfall from "./Snowfall";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Snowfall count={24} />
      <Header />

      <main className="flex-1 py-10">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
