'use client';

import React from 'react';

const PilotProgramSection = () => {
  const totalPilots = 5;
  const acquiredPilots = 1;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-light text-cyan-300 mb-2">
            Pilot Program
          </h2>
          <p className="text-lg text-gray-300">
            Join our exclusive launch phase - limited to 5 pilot customers
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-300">
            <span>{acquiredPilots} position filled</span>
            <span>{totalPilots - acquiredPilots} positions remaining</span>
          </div>
          <div className="h-4 bg-slate-700/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-1000"
              style={{ width: `${(acquiredPilots / totalPilots) * 100}%` }}
            />
          </div>
          <div className="flex justify-center mt-6">
            <p className="text-gray-300 text-center max-w-xl">
              As one of our first 5 pilot customers, you'll help shape how this technology transforms expert work in your industry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PilotProgramSection;