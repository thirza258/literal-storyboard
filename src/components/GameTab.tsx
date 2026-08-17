import { useEffect, useRef, useState } from "react";
import type { SentimentVerdict } from "../ai_handler/sentiment";

interface GameTabProps {
  readonly onRoll: (steps: number) => void;
  readonly allies: number;
  readonly enemies: number;
  readonly winMargin: number;
  readonly isMoving: boolean;
  readonly lastRoll: number;
  readonly currentCity: string;
  readonly verdict: SentimentVerdict | null;
}

const DICE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
const SHAKE_MS = 500;

function GameTab({
  onRoll,
  allies,
  enemies,
  winMargin,
  isMoving,
  lastRoll,
  currentCity,
  verdict,
}: GameTabProps) {
  const [rolling, setRolling] = useState(false);
  const [face, setFace] = useState(lastRoll || 1);
  const cleanups = useRef<Array<() => void>>([]);

  useEffect(() => {
    const pending = cleanups.current;
    return () => {
      pending.forEach((stop) => stop());
      pending.length = 0;
    };
  }, []);

  const handleRoll = () => {
    if (rolling || isMoving) return;

    const steps = Math.floor(Math.random() * 6) + 1;
    setRolling(true);

    const spin = window.setInterval(() => {
      setFace(Math.floor(Math.random() * 6) + 1);
    }, 70);
    const settle = window.setTimeout(() => {
      window.clearInterval(spin);
      setFace(steps);
      setRolling(false);
    }, SHAKE_MS);

    cleanups.current.push(() => {
      window.clearInterval(spin);
      window.clearTimeout(settle);
    });

    onRoll(steps);
  };

  const margin = allies - enemies;
  const busy = rolling || isMoving;

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 gilded-border-glow text-white ls-fade-in space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold text-amber-400 uppercase tracking-wider font-cinzel">
            📍 Current Location: {currentCity}
          </p>
          <div className="flex items-center gap-3 text-base font-bold">
            <span className="text-emerald-400">🤝 Allies: {allies}</span>
            <span className="text-slate-600">·</span>
            <span className="text-rose-400">⚔️ Enemies: {enemies}</span>
          </div>
          <p className="text-xs text-slate-300">
            {margin >= 0
              ? `Win ${winMargin - margin} more ${
                  winMargin - margin === 1 ? "ally" : "allies"
                } to restore the Emerald Crown.`
              : `You are ${-margin} behind — ${
                  winMargin + margin
                } more enemies and Eldoria falls to Malakar.`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`text-5xl leading-none select-none drop-shadow ${
              rolling ? "ls-dice-rolling" : ""
            }`}
            aria-live="polite"
            aria-label={`Dice showing ${face}`}
          >
            {DICE_FACES[face - 1]}
          </div>
          <button
            className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed font-bold font-cinzel py-2.5 px-6 rounded-xl shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 text-sm"
            onClick={handleRoll}
            disabled={busy}
          >
            {busy ? "Travelling…" : "🎲 ROLL DICE"}
          </button>
        </div>
      </div>

      {/* Score balance tug-of-war bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>Realm Allegiance</span>
          <span>Win Margin: ±{winMargin}</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-slate-950 border border-slate-800 overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 shadow-sm"
            style={{ width: `${(allies / Math.max(allies + enemies, 1)) * 100}%` }}
          />
          <div
            className="h-full bg-rose-600 transition-all duration-500 shadow-sm"
            style={{ width: `${(enemies / Math.max(allies + enemies, 1)) * 100}%` }}
          />
        </div>
      </div>

      {verdict && (
        <div
          className={`p-3 rounded-xl border text-xs ls-pop-in flex items-center gap-2 ${
            verdict.sentiment
              ? "bg-emerald-950/70 border-emerald-500/50 text-emerald-200"
              : "bg-rose-950/70 border-rose-500/50 text-rose-200"
          }`}
        >
          <span className="text-base">{verdict.sentiment ? "🤝" : "⚔️"}</span>
          <span><strong>AI Arbiter:</strong> {verdict.reason}</span>
        </div>
      )}
    </div>
  );
}

export default GameTab;
