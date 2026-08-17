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
    body: "Eldoria's people speak your name in the taverns and the great hall alike. The Emerald Crown rests easy once more upon the rightful throne.",
    frame: "from-slate-950 via-emerald-950/60 to-slate-950 border-emerald-500/40",
    heading: "text-gold-gradient",
  },
  defeat: {
    title: "Eldoria Turns Away",
    subtitle: "🕯️ The shadows lengthen over the realm 🕯️",
    body: "Too many doors closed at your words. Malakar's dark whispers find willing ears where yours did not.",
    frame: "from-slate-950 via-rose-950/60 to-slate-950 border-rose-500/40",
    heading: "text-rose-300",
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
      className={`min-h-[75vh] bg-gradient-to-b ${copy.frame} border rounded-2xl flex items-center justify-center p-6 ls-fade-in`}
    >
      <div className="relative max-w-2xl w-full">
        <div className="absolute -inset-4 animate-pulse pointer-events-none">
          <div className="h-full w-full bg-gradient-to-r from-amber-400/10 via-yellow-500/15 to-emerald-500/10 opacity-30 blur-2xl rounded-full" />
        </div>

        <div className="relative bg-slate-950/90 backdrop-blur-md p-8 sm:p-12 rounded-2xl gilded-border-glow shadow-2xl text-center space-y-6">
          <h1
            className={`text-4xl sm:text-5xl font-extrabold font-cinzel ${copy.heading}`}
          >
            {copy.title}
          </h1>

          <p className="text-xl sm:text-2xl text-amber-200/90 font-cinzel italic">{copy.subtitle}</p>
          <p className="max-w-xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed">{copy.body}</p>

          <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-black/60 border border-amber-500/30 text-sm font-semibold">
            <span className="text-emerald-400">🤝 {allies} Allies</span>
            <span className="text-slate-600">·</span>
            <span className="text-rose-400">⚔️ {enemies} Enemies</span>
          </div>

          <div>
            <button
              onClick={onRestart}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-bold font-cinzel text-base shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
            >
              Ride Out Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Outcome;
