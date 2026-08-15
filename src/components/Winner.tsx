import React from "react";
import type { OutcomeKind } from "../App";

interface OutcomeProps {
  outcome: OutcomeKind | null;
  allies: number;
  enemies: number;
  onRestart: () => void;
}

const COPY = {
  victory: {
    title: "You Are Victorious!",
    subtitle: "✨ The realm rallies to your banner ✨",
    body: "Eldoria's people speak your name in the taverns and the great hall alike. The Emerald Crown rests easy.",
    frame: "from-purple-900 via-indigo-800 to-blue-900",
    heading: "from-yellow-200 via-pink-200 to-purple-200",
  },
  defeat: {
    title: "Eldoria Turns Away",
    subtitle: "🕯️ The shadows lengthen over the realm 🕯️",
    body: "Too many doors closed at your words. Malakar's whispers find willing ears where yours did not.",
    frame: "from-slate-900 via-red-950 to-black",
    heading: "from-rose-200 via-orange-200 to-amber-200",
  },
} as const;

/** Shown for both endings — the game used to only have a win screen. */
const Outcome: React.FC<OutcomeProps> = ({
  outcome,
  allies,
  enemies,
  onRestart,
}) => {
  const copy = COPY[outcome ?? "victory"];

  return (
    <div
      className={`min-h-[80vh] bg-gradient-to-b ${copy.frame} flex items-center justify-center rounded-lg ls-fade-in`}
    >
      <div className="relative">
        <div className="absolute -inset-4 animate-pulse">
          <div className="h-full w-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 opacity-20 blur-xl rounded-full" />
        </div>

        <div className="relative bg-black/40 backdrop-blur-sm p-12 rounded-2xl border border-white/10 shadow-2xl text-center">
          <h1
            className={`text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${copy.heading} mb-4`}
          >
            {copy.title}
          </h1>

          <p className="text-2xl text-white/80 italic mb-6">{copy.subtitle}</p>
          <p className="max-w-xl text-white/70 mb-6">{copy.body}</p>

          <p className="text-white/90 font-semibold mb-8">
            Final tally — {allies} allies · {enemies} enemies
          </p>

          <button
            onClick={onRestart}
            className="px-6 py-3 rounded-full bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition-colors"
          >
            Ride out again
          </button>

          <div className="absolute -left-8 -right-8 -bottom-8 h-2 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          <div className="absolute -left-2 -top-2 w-4 h-4 bg-purple-400 rounded-full animate-ping" />
          <div className="absolute -right-2 -top-2 w-4 h-4 bg-pink-400 rounded-full animate-ping [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
};

export default Outcome;
