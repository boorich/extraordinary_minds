'use client';

import React, { useState } from 'react';
import MCPHeader from './MCPHeader';
import MCPDialogue from './dialogue/MCPDialogue';
import TransformationSection from './TransformationSection';
import PilotProgramSection from './PilotProgramSection';
import { DialogueMetrics } from '@/types/dialogue';

const VisionaryLanding = () => {
  const [dialogueMetrics, setDialogueMetrics] = useState<DialogueMetrics | null>(null);

  const handleMetricsUpdate = (metrics: DialogueMetrics) => {
    setDialogueMetrics(metrics);
  };

  return (
    <div className="text-slate-100">
      <MCPHeader />
      <div className="professional-gradient">
        <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 relative" role="main">
          <div className="relative z-10">
            {/* Hero Section */}
            <div className="text-center mb-24">
              <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white mb-6">
                <span className="font-normal">Model Context Protocol</span>
                <span className="text-cyan-300"> Servers</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light tracking-wide">
                "Connecting Your Experts with AI and Company Resources"
              </p>
            </div>

            {/* Chat Interface */}
            <div className="max-w-4xl mx-auto mb-24 bg-slate-900/40 rounded-2xl p-8 backdrop-blur-sm border border-white/10 shadow-2xl">
              <MCPDialogue onMetricsUpdate={handleMetricsUpdate} />
            </div>

            {/* Social Proof Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24">
              {sections.credibility.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl transform hover:scale-[1.02] transition-transform duration-300"
                  role="presentation"
                >
                  <div className="text-cyan-300 mb-4 flex justify-center" aria-hidden="true">
                    {item.icon}
                  </div>
                  <div className="text-3xl font-light text-white mb-2">{item.stat}</div>
                  <div className="text-lg text-gray-300">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Transformation and Pilot Program Sections */}
            <TransformationSection />
            <div className="mt-24">
              <PilotProgramSection />
            </div>
          </div>
        </main>

        <footer className="bg-slate-900/40 backdrop-blur-sm mt-24" role="contentinfo">
          <div className="max-w-6xl mx-auto px-4 py-12 text-center">
            <p className="text-xl text-cyan-300 font-light">Transforming Enterprise AI</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default VisionaryLanding;