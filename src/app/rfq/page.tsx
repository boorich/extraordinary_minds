import React from 'react';
import RFQChat from '@/components/rfq/RFQChat';

export const metadata = {
  title: 'RFQ Template Generator | Vision Landing',
  description: 'Generate professional RFQ templates through an intelligent chat interface'
};

export default function RFQPage() {
  return (
    <div className="min-h-screen professional-gradient-light">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-4xl font-light tracking-tight text-white mb-4">
            <span className="font-normal">RFQ Template</span>
            <span className="text-cyan-300"> Generator</span>
          </h1>
          <p className="text-xl text-gray-300 font-light tracking-wide">
            Create professional RFQ documents through a guided conversation
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/80 rounded-2xl p-8 backdrop-blur-sm border border-cyan-400/10 shadow-2xl">
            <RFQChat />
          </div>
        </div>
      </main>
    </div>
  );
}