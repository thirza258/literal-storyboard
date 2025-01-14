import { useState } from 'react';

interface GameTabProps {
    readonly onRoll: (newProgress: number) => void;
    readonly allies: number;
    readonly enemy: number;
  }

function GameTab({ onRoll, allies, enemy }: GameTabProps) {
  const [progress, setProgress] = useState(0);

  const handleRoll = () => {
    // Generate a random progress value
    const newProgress = Math.floor(Math.random() * 10); // Example random progress
    setProgress(newProgress);
    onRoll(newProgress); // Pass the progress back to the parent
  };

  return (
    <div className="p-4 rounded-md ml-40">
      <div className="text-white flex items-center justify-between">
        <div>
        <p className="font-bold">Allies Progress: {allies} </p>
        <p className="font-bold">Enemy Progress: {enemy}</p>
        <p > Scores more than 3 than you enemy to Victorious</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full"
            onClick={handleRoll}
          >
            ROLL
          </button>
          <div className="bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded-md">
            {progress}
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
            onClick={() => {}} // Implement 'X' button logic here
          >
            X
          </button>
        </div>
      </div>
      <div className="mt-4">
        {/* Additional content can go here */}
      </div>
    </div>
  );
}

export default GameTab;
