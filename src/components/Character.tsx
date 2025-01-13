import React from 'react';

interface Board {
  name: string;
  assign: number;
  X_location: number;
  Y_location: number;
}

interface CharacterProps {
  boards: Board[];
  index: number;
}

const Character: React.FC<CharacterProps> = ({ boards, index }) => {
    if (boards.length === 0) {
        return null; // Return nothing if there are no boards
      }
    
      const randomBoard = boards[index % boards.length];

  return (
    <div
      className="character"
      style={{
        position: 'absolute',
        left: randomBoard.X_location + 10,
        top: randomBoard.Y_location + 10,
        width: '30px',
        height: '30px',
        backgroundColor: 'red',
        borderRadius: '50%',
      }}
    />
  );
};

export default Character;
