import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white py-4 shadow">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <div className="text-xl">🎄</div>
          </div>
          <div>
            <div className="font-bold">Christmas Wishes</div>
            <div className="text-xs opacity-80">Share festive wishes</div>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "underline font-semibold" : "opacity-90"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/make"
            className={({ isActive }) =>
              isActive ? "underline font-semibold" : "opacity-90"
            }
          >
            Make Wish
          </NavLink>
          <NavLink
            to="/wish-others"
            className={({ isActive }) =>
              isActive ? "underline font-semibold" : "opacity-90"
            }
          >
            Wishes
          </NavLink>
          <a href="#" className="ml-4 text-sm bg-white/10 px-3 py-1 rounded">
            Original
          </a>
        </nav>
      </div>
    </header>
  );
}
