'use client';

import React, { useState } from 'react';
import MCPHeader from './MCPHeader';
import { CardSection } from './CardSection';
import MCPDialogue from './dialogue/MCPDialogue';
import { sections } from '@/config/sections';
import { DialogueMetrics } from '@/types/dialogue';

const VisionaryLanding = () => {
  const [dialogueMetrics, setDialogueMetrics] = useState<DialogueMetrics | null>(null);

  const handleMetricsUpdate = (metrics: DialogueMetrics) => {
    setDialogueMetrics(metrics);
  };

  return (
    <div className="min-h-screen text-slate-100">
      <MCPHeader />
      <div className="professional-gradient min-h-screen">
        <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 relative min-h-screen" role="main">
          <div className="relative z-10 space-y-24">
            {/* Hero Section */}
            <div className="text-center space-y-8">
              <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white mb-6 fade-in">
                <span className="font-normal">Model Context Protocol</span>
                <span className="text-cyan-300"> Servers</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light tracking-wide fade-in-delayed">
                "Connecting Your Experts with AI and Company Resources"
              </p>
            </div>

            {/* Chat Interface */}
            <div className="max-w-4xl mx-auto bg-slate-900/40 rounded-2xl p-8 backdrop-blur-sm border border-white/10 shadow-2xl">
              <MCPDialogue onMetricsUpdate={handleMetricsUpdate} />
            </div>

            {/* Transformation Section */}
            <div className="max-w-4xl mx-auto space-y-12">
              <h2 className="text-3xl md:text-4xl font-light tracking-tight text-cyan-300 text-center mb-12">
                The Transformation
              </h2>
              <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl">
                <p className="text-xl md:text-2xl leading-relaxed text-gray-300 font-light">
                  Every company has valuable expertise locked in their people, processes, and data. MCP servers unlock this potential by connecting your experts with advanced AI capabilities and your existing resources. This creates a powerful synergy that enhances productivity and unlocks new possibilities.
                </p>
                <p className="text-xl md:text-2xl leading-relaxed text-gray-300 font-light mt-6">
                  As one of our first 5 pilot customers, you'll help shape how this technology transforms expert work in your industry.
                </p>
              </div>
            </div>

            {/* Social Proof Section with updated styling */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {sections.credibility.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl transform hover:scale-105 transition-transform duration-300"
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

            {/* Is This You Section with updated styling */}
            <div className="max-w-4xl mx-auto">
              <CardSection title="Is This You?" items={sections.traits} />
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