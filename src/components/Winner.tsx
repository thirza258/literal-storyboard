
import React from 'react';

const WinPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-800 to-blue-900 flex items-center justify-center">
      <div className="relative">
        {/* Magical sparkles */}
        <div className="absolute -inset-4 animate-pulse">
          <div className="h-full w-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 opacity-20 blur-xl rounded-full"></div>
        </div>

        {/* Main content */}
        <div className="relative bg-black/30 backdrop-blur-sm p-12 rounded-2xl border border-white/10 shadow-2xl">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 mb-4 animate-bounce">
            You Are Victorious!
          </h1>
          
          <p className="text-2xl text-white/80 text-center italic">
            ✨ The stars align in your favor ✨
          </p>

          {/* Decorative runes */}
          <div className="absolute -left-8 -right-8 -bottom-8 h-2 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          <div className="absolute -left-2 -top-2 w-4 h-4 bg-purple-400 rounded-full animate-ping"></div>
          <div className="absolute -right-2 -top-2 w-4 h-4 bg-pink-400 rounded-full animate-ping delay-300"></div>
        </div>
      </div>
    </div>
  );
};

export default WinPage;