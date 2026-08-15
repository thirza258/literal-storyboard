import React, { useState } from "react";
import { hasApiKey } from "../ai_handler/client";

interface LoginProps {
  onStart: (username: string, boardSize: number) => void;
  winMargin: number;
}

const Login: React.FC<LoginProps> = ({ onStart, winMargin }) => {
  const [input, setInput] = useState("");
  const [boardSizeInput, setBoardSizeInput] = useState(8);
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) {
      setError("Every traveller needs a name.");
      return;
    }
    setError("");
    onStart(input.trim(), boardSizeInput);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-6 border rounded-lg shadow-2xl bg-white ls-pop-in"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Literal Storyboard</h1>

        <p className="mb-4 text-justify text-sm text-gray-700">
          In the mystical kingdom of Eldoria, the peace maintained by the powerful
          Emerald Crown is shattered when the sorcerer Malakar steals it. King Alden
          calls upon four heroes — Sir Roderick, Elysia, Thrain and Soraya — to
          retrieve it from the Shadowmoor. You ride in their wake, and every soul you
          meet is deciding which side of the story they are on.
        </p>

        <p className="mb-4 text-sm text-gray-700">
          Roll to travel the route. At each city an inhabitant tells you something and
          asks a question — the AI grades the <em>tone</em> of your reply. Kind answers
          win allies, cruel ones make enemies. Lead by {winMargin} to win; fall behind
          by {winMargin} and Eldoria turns away.
        </p>

        {!hasApiKey && (
          <p className="mb-4 rounded bg-amber-100 border border-amber-300 p-2 text-xs text-amber-900">
            No <code>VITE_OPENROUTER_API_KEY</code> found — the game runs on bundled
            stories and artwork. Add a key to <code>.env</code> for AI-written scenes
            and generated backgrounds.
          </p>
        )}

        <label className="block mb-2 font-medium" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          type="text"
          placeholder="Enter your username"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 rounded w-full"
          autoFocus
        />

        <label className="block mt-4 mb-2 font-medium" htmlFor="boardSize">
          Cities on the route (8–32)
        </label>
        <select
          id="boardSize"
          value={boardSizeInput}
          onChange={(e) => setBoardSizeInput(Number(e.target.value))}
          className="border p-2 rounded w-full"
        >
          {Array.from({ length: 25 }, (_, i) => i + 8).map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors"
        >
          Begin the journey
        </button>
      </form>
    </div>
  );
};

export default Login;
