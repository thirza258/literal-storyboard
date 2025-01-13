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
    <div className=" w-full h-[70vh] relative"
    style={{
      backgroundImage: `url(${fantasyMap})`,
      backgroundSize: 'cover',  // Ensures the background image covers the container
      backgroundPosition: 'center',  // Centers the background image
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
            border: '2px solid gray',
            borderRadius: '8px',
          }}
          className="flex items-center justify-center"
        >
          {board.name}
        </div>
      ))}
    </div>
  );
};

export default MatrixBoard;
