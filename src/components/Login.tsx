import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  setUsername: (username: string) => void;
  setBoardSize: (size: number) => void;
}

const Login: React.FC<LoginProps> = ({ setUsername, setBoardSize }) => {
  const [input, setInput] = useState('');
  const [boardSizeInput, setBoardSizeInput] = useState(8);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (input.trim() && boardSizeInput >= 8 && boardSizeInput <= 32) {
      setUsername(input);
      setBoardSize(boardSizeInput);
      navigate('/');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-4 border rounded shadow-lg bg-white">
        <h1 className="text-2xl font-bold mb-4 text-center">Literal Storyboard</h1>
        <p className="mb-4 text-justify">
          In the mystical kingdom of Eldoria, the peace maintained by the powerful Emerald Crown is shattered when the evil sorcerer Malakar steals it, threatening to plunge the land into darkness. King Alden calls upon four heroes—Sir Roderick, Elysia, Thrain, and Soraya—to embark on a perilous quest to retrieve the crown. Their journey leads them through dangerous terrains and the sinister Shadowmoor to Malakar's fortress. In a climactic battle, the adventurers confront Malakar, with Soraya using a powerful spell to purify the crown. Sir Roderick delivers the final blow, defeating Malakar and restoring peace to Eldoria.
        </p>
        <label className="block mb-2">Username:</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <label className="block mt-4 mb-2">Board Size (8-32):</label>
        <input
          type="number"
          placeholder="Enter board size (8-32)"
          value={boardSizeInput}
          onChange={(e) => setBoardSizeInput(Math.max(0, Math.min(32, Number(e.target.value))))}
          className="border p-2 rounded w-full"
          min="8"
          max="32"
        />
        <button
          onClick={handleLogin}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Login
        </button>
      </div>
    </div>
  );
  
};

export default Login;