import React from "react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  onExitToMenu?: () => void;
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
    isActive
      ? "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-bold shadow-md shadow-amber-500/20"
      : "text-slate-300 hover:bg-slate-800/80 hover:text-amber-300"
  }`;

const Sidebar: React.FC<SidebarProps> = ({ onExitToMenu }) => (
  <aside className="w-36 h-[calc(100vh-3.5rem)] p-3 fixed top-14 left-0 border-r border-amber-500/20 bg-slate-950/90 backdrop-blur-md z-20 flex flex-col justify-between">
    <div className="space-y-4">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 font-cinzel">
        Realm Route
      </div>
      <ul className="space-y-1.5">
        <li>
          <NavLink to="/" className={linkClass} end>
            <span>🗺️</span>
            <span>Map Board</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={linkClass}>
            <span>📜</span>
            <span>About Lore</span>
          </NavLink>
        </li>
      </ul>
    </div>

    {/* Bottom menu button */}
    {onExitToMenu && (
      <div className="pt-3 border-t border-slate-800">
        <button
          onClick={onExitToMenu}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800 transition-colors"
        >
          <span>🏰</span>
          <span>Main Menu</span>
        </button>
      </div>
    )}
  </aside>
);

export default Sidebar;
