import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  setUsername: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ setUsername }) => {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (input.trim()) {
      setUsername(input);
      navigate('/');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-4 border rounded shadow-lg">
        <input
          type="text"
          placeholder="Enter your username"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleLogin}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
