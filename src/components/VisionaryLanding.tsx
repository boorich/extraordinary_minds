'use client';

import React, { useState } from 'react';
import { CardSection } from './CardSection';
import ParallaxHero from './ParallaxHero';
import MCPDataFlow from './interactive/MatrixRain';
import DigitalCursor from './visual/DigitalCursor';
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
    <div className="min-h-screen cosmic-background text-slate-100">
      <DigitalCursor />
      <MCPDataFlow />
      <ParallaxHero />

      <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 relative min-h-screen" role="main">
        <div className="relative z-10">
          {/* T4E MCP Experience */}
          <div className="mb-16">
            <h3 className="text-2xl md:text-3xl text-cyan-400 mb-4 md:mb-6 glow text-center">Experience the Future of Enterprise AI</h3>
            <div className="text-center text-slate-300 text-sm mb-6 italic">
              "Where Human Expertise Meets AI Power through Model Context Protocol"
            </div>
            <MCPDialogue onMetricsUpdate={handleMetricsUpdate} />
          </div>

          <div className="mb-12 md:mb-16">
            <h3 className="text-2xl md:text-3xl text-cyan-400 mb-4 md:mb-6 glow">The Transformation</h3>
            <div className="bg-slate-800/80 p-4 md:p-6 rounded-lg border border-cyan-400 hover:border-cyan-300 transition-colors backdrop-blur-sm">
              <p className="text-base md:text-lg leading-relaxed">
                Every industry is on the brink of an AI revolution. But connecting advanced AI capabilities with your company's existing resources and expert knowledge has been a challenge - until now. T4E's Model Context Protocol servers bridge this gap, creating a powerful synergy between LLMs, domain experts, and your company's digital assets. As one of our first 5 pilot customers, you'll be at the forefront of this transformation, shaping how AI enhances human expertise in the enterprise.
              </p>
            </div>
          </div>

          {/* Social Proof Section */}
          <div className="mb-12 md:mb-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sections.credibility.map((item, index) => (
              <div 
                key={index} 
                className="bg-slate-800/80 p-4 md:p-6 rounded-lg border border-cyan-400 hover:border-cyan-300 transition-colors backdrop-blur-sm text-center"
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

      <footer className="text-center py-4 md:py-6 bg-slate-800/50 border-t-2 border-cyan-400 backdrop-blur-sm relative z-10" role="contentinfo">
        <p className="text-lg md:text-xl text-cyan-200">Transforming Enterprise AI</p>
      </footer>
    </div>
  );
};

export default VisionaryLanding;