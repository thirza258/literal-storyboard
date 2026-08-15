import React from "react";
import character from "../assets/character.png";
import type { Board } from "../game/board";

interface CharacterProps {
  boards: Board[];
  index: number;
  /** Highlights the token while it walks between cities. */
  moving: boolean;
}

const Character: React.FC<CharacterProps> = ({ boards, index, moving }) => {
  if (boards.length === 0) return null;

  const stop = boards[index % boards.length];

  return (
    <div
      className={`ls-token absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-yellow-300 shadow-lg ${
        moving ? "ls-token-active" : ""
      }`}
      style={{
        left: `${stop.x * 100}%`,
        top: `${stop.y * 100}%`,
        width: "44px",
        height: "44px",
        backgroundImage: `url(${character})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-label={`Your party is at ${stop.name}`}
    />
  );
};

export default Character;
