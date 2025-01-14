import React from 'react';
import { Link } from 'react-router-dom';

interface NavBarProps {
  username: string;
}

const NavBar: React.FC<NavBarProps> = ({ username }) => {

  return (
    <nav className=" fixed top-0 left-0 w-full text-white h-12 flex items-center px-4 border-b-2 border-white justify-between z-10">
      <h1 className="text-lg font-bold">Literal Storyboard</h1>
        <span className="text-white px-4 py-2">{username}</span>
      
    </nav>
  );
};

export default NavBar;
