'use client';

import React, { useState, useCallback } from 'react';
import MCPHeader from './MCPHeader';
import MCPDialogue from './dialogue/MCPDialogue';
import TransformationSection from './TransformationSection';
import PilotProgramSection from './PilotProgramSection';
import { DialogueMetrics } from '@/types/dialogue';
import { NetworkData } from '@/types/network';
import { NetworkUpdate } from '@/lib/network/parser';
import { updateNetworkData } from '@/lib/network/updater';

const VisionaryLanding = () => {
  const [dialogueMetrics, setDialogueMetrics] = useState<DialogueMetrics | null>(null);
  const [networkData, setNetworkData] = useState<NetworkData>({
    nodes: [
      { id: "MCP Server", height: 2, size: 32, color: "rgb(244, 117, 96)", metadata: {
        title: "MCP Server",
        description: "Core Model Context Protocol Server",
        type: "Core System",
        details: {
          role: "Central Hub",
          purpose: "AI and Resource Integration"
        }
      }},
      { id: "AI Models", height: 1, size: 24, color: "rgb(97, 205, 187)", metadata: {
        title: "AI Models",
        description: "AI and Machine Learning Models",
        type: "Category",
        details: {
          category: "AI",
          capabilities: "ML & LLM Integration"
        }
      }},
      { id: "Company Resources", height: 1, size: 24, color: "rgb(97, 205, 187)", metadata: {
        title: "Company Resources",
        description: "Enterprise Systems and Data",
        type: "Category",
        details: {
          category: "Infrastructure",
          scope: "Enterprise Systems"
        }
      }},
      { id: "LLM Clients", height: 1, size: 24, color: "rgb(97, 205, 187)", metadata: {
        title: "LLM Clients",
        description: "Client Applications and Tools",
        type: "Category",
        details: {
          category: "Clients",
          focus: "User Interaction"
        }
      }}
    ],
    links: [
      { source: "MCP Server", target: "AI Models", distance: 80 },
      { source: "MCP Server", target: "Company Resources", distance: 80 },
      { source: "MCP Server", target: "LLM Clients", distance: 80 }
    ]
  });

  const handleMetricsUpdate = (metrics: DialogueMetrics) => {
    setDialogueMetrics(metrics);
  };

  const handleNetworkUpdate = useCallback((update: NetworkUpdate) => {
    console.log('=== VisionaryLanding Network Update ===');
    console.log('Received update:', update);
    if (update) {
      setNetworkData(current => {
        console.log('Current network data:', current);
        const updated = updateNetworkData(current, update);
        console.log('Updated network data:', updated);
        return updated;
      });
    }
  }, []);

  return (
    <div className="text-slate-100">
      <MCPHeader />
      <div className="professional-gradient">
        <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 relative" role="main">
          <div className="relative z-10">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white mb-4">
                <span className="font-normal">Model Context Protocol</span>
                <span className="text-cyan-300"> Servers</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light tracking-wide">
                "Connecting Your Experts with AI and Company Resources"
              </p>
            </div>

            {/* Chat Interface */}
            <div className="max-w-4xl mx-auto mb-8 bg-slate-900/40 rounded-2xl p-8 backdrop-blur-sm border border-white/10 shadow-2xl">
              <MCPDialogue onMetricsUpdate={handleMetricsUpdate} onNetworkUpdate={handleNetworkUpdate} />
            </div>

            {/* Transformation Section with Diagram */}
            <TransformationSection networkData={networkData} />

            {/* Pilot Program Section */}
            <div className="mt-8">
              <PilotProgramSection />
            </div>
          </div>
        </main>

        <footer className="bg-slate-900/40 backdrop-blur-sm mt-8" role="contentinfo">
          <div className="max-w-6xl mx-auto px-4 py-8 text-center">
            <p className="text-xl text-cyan-300 font-light">Transforming Enterprise AI Integration</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default VisionaryLanding;