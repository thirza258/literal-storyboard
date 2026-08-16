import React from "react";

interface NavBarProps {
  username: string;
  allies: number;
  enemies: number;
}

const NavBar: React.FC<NavBarProps> = ({ username, allies, enemies }) => (
  <nav className="fixed top-0 left-0 w-full h-12 z-20 flex items-center justify-between px-4 text-white bg-black/70 backdrop-blur-sm border-b-2 border-white/40">
    <h1 className="text-lg font-bold">Literal Storyboard</h1>
    <div className="flex items-center gap-4 text-sm">
      <span className="text-emerald-300">🤝 {allies}</span>
      <span className="text-rose-300">⚔️ {enemies}</span>
      <span className="font-semibold">{username}</span>
    </div>
  </nav>
);

export default NavBar;
