'use client';

import React from 'react';

const ShipsWheel = () => {
  return (
    <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] mx-auto my-12 md:my-24">
      {/* The main wheel image */}
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: "url('/extraordinary_minds/ship-wheel.png')",
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: 'translate(-15px, -10px)'
        }}
      />

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-4 md:p-6 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center backdrop-blur-sm bg-slate-900/50 border border-cyan-400/30">
          <div>
            <h4 className="text-base md:text-lg font-bold text-cyan-400 mb-2 title-font">
              The Journey Awaits
            </h4>
            <p className="text-xs md:text-sm text-cyan-100">
              Chart your course to greatness
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipsWheel;