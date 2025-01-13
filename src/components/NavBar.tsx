import React from 'react';
import { Link } from 'react-router-dom';

interface NavBarProps {
  username: string;
}

const NavBar: React.FC<NavBarProps> = ({ username }) => {
  return (
    <nav className="bg-white fixed top-0 left-0 w-full text-black h-12 flex items-center px-4 border-b-2 border-black justify-between z-10">
      <h1 className="text-lg font-bold">Literal Storyboard</h1>
      {username ? (
        <span className="text-black px-4 py-2">{username}</span>
      ) : (
        <Link
          to="/login"
          className="text-black px-4 py-2 hover:bg-gray-600 hover:text-white rounded transition-colors duration-200"
        >
          Login
        </Link>
      )}
    </nav>
  );
};

export default NavBar;
