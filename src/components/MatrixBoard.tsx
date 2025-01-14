import React from 'react';
import fantasyMap from '../assets/map.svg';

interface Board {
  name: string;
  assign: number;
  X_location: number;
  Y_location: number;
}

interface MatrixBoardProps {
  boards: Board[];
}

const MatrixBoard: React.FC<MatrixBoardProps> = ({ boards }) => {
  return (
    <div
      className="w-full h-[70vh] relative"
      style={{
        backgroundImage: `url(${fantasyMap})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {boards.map((board) => (
        <div
          key={board.assign}
          style={{
            position: 'absolute',
            left: board.X_location,
            top: board.Y_location,
            width: '50px',
            height: '50px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
          className="flex items-center justify-center"
        >
          <span
            className="text-white text-sm font-bold px-2 py-1 rounded"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)', // Stronger text shadow
            }}
          >
            {board.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MatrixBoard;
