import React, { useState } from "react";
import { Link } from "react-router-dom";
import { hasApiKey } from "../ai_handler/client";
import SEO from "./SEO";

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
      setError("Every traveller needs a name to venture into Eldoria.");
      return;
    }
    setError("");
    onStart(input.trim(), boardSizeInput);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 ls-fade-in">
      <SEO
        title="Embark on Quest — Literal Storyboard AI Game Agent"
        description="Begin your journey across Eldoria. Speak with AI agents, navigate the procedural fantasy map, and win the realm."
      />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl p-8 rounded-2xl gilded-border-glow bg-slate-900/95 backdrop-blur-xl shadow-2xl space-y-6"
      >
        <div className="text-center space-y-1">
          <Link
            to="/"
            className="text-xs text-amber-400/80 hover:text-amber-300 font-cinzel tracking-wider uppercase mb-1 inline-block"
          >
            ← Back to Realm Overview
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold font-cinzel text-gold-gradient">
            Literal Storyboard
          </h1>
          <p className="text-xs text-slate-400 font-medium">The Quest for the Emerald Crown</p>
        </div>

        <div className="p-4 rounded-xl bg-black/50 border border-amber-500/20 text-xs text-slate-300 space-y-2 leading-relaxed">
          <p>
            In the mystical kingdom of Eldoria, peace was shattered when the sorcerer <strong>Malakar</strong> stole the Emerald Crown into the Shadowmoor. King Alden called upon four heroes — Sir Roderick, Elysia, Thrain, and Soraya. You ride in their wake.
          </p>
          <p>
            Roll to travel the route. At each city, an inhabitant asks a question — the AI grades the <em>tone</em> of your reply. Kind answers win allies, cruel ones make enemies. Lead by <strong>{winMargin}</strong> to win; fall behind by <strong>{winMargin}</strong> and the realm turns away.
          </p>
        </div>

        {!hasApiKey && (
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-200">
            No <code>VITE_OPENROUTER_API_KEY</code> detected — running in bundled high-fantasy offline mode. Add a key to <code>.env</code> for live generative AI stories and scene backgrounds.
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider font-cinzel" htmlFor="username">
            Traveller Name
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter your name"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-amber-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm"
            autoFocus
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider font-cinzel" htmlFor="boardSize">
            Cities on the route (8–32)
          </label>
          <select
            id="boardSize"
            value={boardSizeInput}
            onChange={(e) => setBoardSizeInput(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-amber-500/30 text-white focus:outline-none focus:border-amber-400 text-sm"
          >
            {Array.from({ length: 25 }, (_, i) => i + 8).map((size) => (
              <option key={size} value={size}>
                {size} Cities
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-xs text-rose-400 font-semibold">{error}</p>}

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 shadow-lg shadow-amber-500/25 transition-all text-sm flex items-center justify-center gap-2"
        >
          <span>⚔️</span> Begin the Journey
        </button>
      </form>
    </div>
  );
};

export default Login;
