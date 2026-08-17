import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavBarProps {
  username?: string;
  allies?: number;
  enemies?: number;
  onExitGame?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({
  username,
  allies = 0,
  enemies = 0,
  onExitGame,
}) => {
  const location = useLocation();
  const isPlaying = Boolean(username && username.trim() !== "");

  return (
    <nav className="fixed top-0 left-0 w-full h-14 z-30 flex items-center justify-between px-4 sm:px-6 text-white bg-[#0a0a0f]/85 backdrop-blur-md border-b border-amber-500/30">
      {/* Left: Brand Logo & Title */}
      <Link to="/" className="flex items-center gap-2.5 group">
        <span className="text-xl group-hover:scale-110 transition-transform">⚔️</span>
        <span className="font-cinzel font-bold text-base sm:text-lg text-white tracking-wide group-hover:text-amber-300 transition-colors">
          Literal Storyboard
        </span>
        <span className="hidden md:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
          AI Game Agent
        </span>
      </Link>

      {/* Center/Right Navigation or In-Game HUD */}
      {isPlaying ? (
        <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm">
          {/* Tally */}
          <div className="flex items-center gap-2 sm:gap-4 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-amber-500/20">
            <span className="text-emerald-300 font-bold flex items-center gap-1">
              🤝 <span className="hidden sm:inline">Allies:</span> {allies}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-rose-300 font-bold flex items-center gap-1">
              ⚔️ <span className="hidden sm:inline">Enemies:</span> {enemies}
            </span>
          </div>

          {/* Player Badge */}
          <div className="hidden sm:flex items-center gap-1.5 text-amber-300 font-semibold font-cinzel">
            <span>🛡️</span>
            <span>{username}</span>
          </div>

          {/* Quick exit to Landing */}
          {onExitGame && (
            <button
              onClick={onExitGame}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors border border-slate-700"
              title="Return to Realm Overview"
            >
              Main Menu
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
          <div className="hidden md:flex items-center gap-5 text-slate-300 font-medium">
            <a href="/#agents" className="hover:text-amber-300 transition-colors">
              AI Agents
            </a>
            <a href="/#agent-simulator" className="hover:text-amber-300 transition-colors">
              Simulator
            </a>
            <a href="/#lore" className="hover:text-amber-300 transition-colors">
              Lore
            </a>
            <a href="/#how-to-play" className="hover:text-amber-300 transition-colors">
              How to Play
            </a>
            <Link
              to="/about"
              className={`hover:text-amber-300 transition-colors ${
                location.pathname === "/about" ? "text-amber-300 font-semibold" : ""
              }`}
            >
              About
            </Link>
          </div>

          {/* Call to action */}
          <a
            href="/#embark"
            className="px-4 py-1.5 rounded-lg font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-md shadow-amber-500/20 text-xs sm:text-sm transition-all"
          >
            Play Quest
          </a>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
