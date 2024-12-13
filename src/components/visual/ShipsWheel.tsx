'use client';

import React from 'react';

const ShipsWheel = () => {
  return (
    <div className="relative w-[500px] h-[500px] mx-auto my-24">
      {/* The main wheel image */}
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: "url('/ship-wheel.png')",
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: 'translate(-15px, -10px)' // Adjust these values to fine-tune the position
        }}
      />

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-6 w-48 h-48 rounded-full flex items-center justify-center backdrop-blur-sm bg-slate-900/50 border border-cyan-400/30">
          <div>
            <h4 className="text-lg font-bold text-cyan-400 mb-2 title-font">
              The Journey Awaits
            </h4>
            <p className="text-sm text-cyan-100">
              Chart your course to greatness
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipsWheel;