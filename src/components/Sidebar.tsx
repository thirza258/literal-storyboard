import React from "react";
import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded px-2 py-1 transition-colors ${
    isActive ? "bg-yellow-400 text-black font-semibold" : "hover:bg-white/15"
  }`;

const Sidebar: React.FC = () => (
  <div className="text-white w-32 h-screen p-4 fixed top-12 left-0 border-r-2 bg-[#3000BE] border-white z-10">
    <ul className="space-y-3">
      <li>
        <NavLink to="/" className={linkClass} end>
          Game
        </NavLink>
      </li>
      <li>
        <NavLink to="/about" className={linkClass}>
          About
        </NavLink>
      </li>
    </ul>
  </div>
);

export default Sidebar;
