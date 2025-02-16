'use client';

import React from 'react';
import RFQChat from '@/components/rfq/RFQChat';
import RFQFeatureCard from '@/components/rfq/RFQFeatureCard';

export default function RFQContainer() {
  return (
    <div className="min-h-screen professional-gradient-light">
      <div className="py-6 bg-slate-900/40 border-b border-cyan-400/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-light tracking-tight text-white mb-4">
              <span className="font-normal">RFQ Template</span>
              <span className="text-cyan-300"> Generator</span>
            </h1>
            <p className="text-xl text-gray-300 font-light tracking-wide">
              Create professional RFQ documents through a guided conversation
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <RFQFeatureCard />
          
          <div className="bg-slate-800/80 rounded-2xl p-8 backdrop-blur-sm border border-cyan-400/10 shadow-2xl">
            <RFQChat />
          </div>
        </div>
      </main>
    </div>
  );
}