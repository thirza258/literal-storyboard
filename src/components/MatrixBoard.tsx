import React from "react";
import fantasyMap from "../assets/map.svg";
import type { Board } from "../game/board";

interface MatrixBoardProps {
  boards: Board[];
  activeIndex: number;
}

const MatrixBoard: React.FC<MatrixBoardProps> = ({ boards, activeIndex }) => {
  const path = boards.map((board) => `${board.x * 100},${board.y * 100}`).join(" ");

  return (
    <div
      className="w-full h-[70vh] relative rounded-lg overflow-hidden border-2 border-yellow-700/60 shadow-2xl"
      style={{
        backgroundImage: `url(${fantasyMap})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* The route itself, so the next stop is always obvious. */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polyline
          points={path}
          fill="none"
          stroke="rgba(250, 204, 21, 0.55)"
          strokeWidth="0.5"
          strokeDasharray="1.6 1.6"
          strokeLinecap="round"
        />
      </svg>

      {boards.map((board, i) => {
        const isActive = i === activeIndex;
        return (
          <div
            key={board.assign}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
            style={{ left: `${board.x * 100}%`, top: `${board.y * 100}%` }}
          >
            <span
              className={`h-3 w-3 rounded-full border transition-colors duration-300 ${
                isActive
                  ? "bg-yellow-300 border-yellow-100"
                  : "bg-black/60 border-white/70"
              }`}
            />
            <span
              className={`whitespace-nowrap text-[11px] font-bold px-2 py-0.5 rounded transition-colors duration-300 ${
                isActive
                  ? "bg-yellow-400/90 text-black"
                  : "bg-black/60 text-white"
              }`}
              style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}
            >
              {board.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default MatrixBoard;
