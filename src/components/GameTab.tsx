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

    // 1–6, so a roll always moves the party. The old version rolled 0–9 and
    // could strand you on the same city with nothing happening.
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
    <div className="mt-4 p-4 rounded-lg bg-black/60 border border-yellow-700/60 text-white ls-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-yellow-300 uppercase tracking-wide">
            Currently at {currentCity}
          </p>
          <p className="font-bold">
            Allies {allies} · Enemies {enemies}
          </p>
          <p className="text-sm text-gray-300">
            {margin >= 0
              ? `Win ${winMargin - margin} more ${
                  winMargin - margin === 1 ? "ally" : "allies"
                } to claim victory.`
              : `You are ${-margin} behind — ${
                  winMargin + margin
                } more enemies and Eldoria falls.`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`text-5xl leading-none select-none ${
              rolling ? "ls-dice-rolling" : ""
            }`}
            aria-live="polite"
            aria-label={`Dice showing ${face}`}
          >
            {DICE_FACES[face - 1]}
          </div>
          <button
            className="bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-full transition-colors"
            onClick={handleRoll}
            disabled={busy}
          >
            {busy ? "Travelling…" : "ROLL"}
          </button>
        </div>
      </div>

      {/* Score balance, drawn as a tug-of-war between allies and enemies. */}
      <div className="mt-4 h-2 w-full rounded-full bg-gray-700 overflow-hidden flex">
        <div
          className="h-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${(allies / Math.max(allies + enemies, 1)) * 100}%` }}
        />
        <div
          className="h-full bg-rose-600 transition-all duration-500"
          style={{ width: `${(enemies / Math.max(allies + enemies, 1)) * 100}%` }}
        />
      </div>

      {verdict && (
        <p
          className={`mt-3 text-sm ls-pop-in ${
            verdict.sentiment ? "text-emerald-300" : "text-rose-300"
          }`}
        >
          {verdict.sentiment ? "🤝 " : "⚔️ "}
          {verdict.reason}
        </p>
      )}
    </div>
  );
}

export default GameTab;
