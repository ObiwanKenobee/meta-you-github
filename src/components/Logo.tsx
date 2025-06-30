import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full opacity-20 animate-pulse"></div>
      <div className="relative text-2xl font-bold bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
        M
      </div>
      
      {/* Ouroboros circle */}
      <svg 
        className="absolute inset-0 w-full h-full animate-slow-spin" 
        viewBox="0 0 100 100"
      >
        <circle 
          cx="50" 
          cy="50" 
          r="40" 
          fill="none" 
          stroke="url(#ouroboros-gradient)" 
          strokeWidth="2"
          strokeDasharray="10 5" 
        />
        <defs>
          <linearGradient id="ouroboros-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="50%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Logo;