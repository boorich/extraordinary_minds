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
    console.log('Dialogue metrics updated:', metrics);
  };

  return (
    <div className="min-h-screen text-slate-100">
      <MCPHeader />
      <div className="professional-gradient min-h-screen">
        <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 relative min-h-screen" role="main">
          <div className="relative z-10">
            {/* MCP Experience */}
            <div className="mb-16">
              <h3 className="text-2xl md:text-3xl text-cyan-400 mb-4 md:mb-6 text-center">Model Context Protocol Servers</h3>
              <div className="text-center text-slate-300 text-sm mb-6">
                "Connecting Your Experts with AI and Company Resources"
              </div>
              <MCPDialogue onMetricsUpdate={handleMetricsUpdate} />
            </div>

            <div className="mb-12 md:mb-16">
              <h3 className="text-2xl md:text-3xl text-cyan-400 mb-4 md:mb-6">The Transformation</h3>
              <div className="bg-white/5 p-4 md:p-6 rounded-lg backdrop-blur-sm">
                <p className="text-base md:text-lg leading-relaxed">
                  Every company has valuable expertise locked in their people, processes, and data. MCP servers unlock this potential by connecting your experts with advanced AI capabilities and your existing resources. This creates a powerful synergy that enhances productivity and unlocks new possibilities. As one of our first 5 pilot customers, you'll help shape how this technology transforms expert work in your industry.
                </p>
              </div>
            </div>

            {/* Social Proof Section */}
            <div className="mb-12 md:mb-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sections.credibility.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white/5 p-4 md:p-6 rounded-lg backdrop-blur-sm text-center"
                  role="presentation"
                >
                  <div className="text-cyan-400 mb-2 flex justify-center" aria-hidden="true">
                    {item.icon}
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-white mb-1">{item.stat}</div>
                  <div className="text-sm text-slate-300">{item.label}</div>
                </div>
              ))}
            </div>

            <CardSection title="Is This You?" items={sections.traits} />
          </div>
        </main>

        <footer className="text-center py-4 md:py-6 bg-white/5 backdrop-blur-sm relative z-10" role="contentinfo">
          <p className="text-lg md:text-xl text-cyan-200">Transforming Enterprise AI</p>
        </footer>
      </div>
    </div>
  );
};

export default VisionaryLanding;