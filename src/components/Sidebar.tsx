import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="text-white w-32 h-screen p-4 fixed top-12 border-r-2 bg-[#3000BE] border-white z-10">
      <ul>
        <li className="mb-4"><Link to="/">Game</Link></li>
        <li className="mb-4"><Link to="/about">About</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
