'use client';

import React from 'react';
import MCPArchitecture from './MCPArchitectureNivo';
import { NetworkData } from '@/types/network';

import { analyzeNetworkForTooling, generateCardContent } from '@/lib/mcp/toolRecommendations';

interface TransformationSectionProps {
  networkData?: NetworkData;
}

const TransformationSection = ({ networkData }: TransformationSectionProps) => {
  console.log('=== TransformationSection Render ===');
  console.log('Received networkData:', networkData);
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Disable description box
      <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl">
        <p className="text-lg leading-relaxed text-gray-300">
          Every company has valuable expertise locked in their people, processes, and data. 
          <span className="font-semibold"> MCP</span> servers unlock this potential by connecting your experts 
          with advanced AI capabilities and your existing resources. This creates a 
          powerful synergy that enhances productivity and unlocks new possibilities.
        </p>
      </div>
      */}

      <div className="bg-slate-900/40 rounded-2xl p-4 backdrop-blur-sm border border-white/10 shadow-2xl">
        <MCPArchitecture data={networkData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(() => {
          const recommendations = analyzeNetworkForTooling(networkData || {});
          const cardContent = generateCardContent(recommendations);
          
          return [
            { title: cardContent.rag.title, description: cardContent.rag.description },
            { title: cardContent.functions.title, description: cardContent.functions.description },
            { title: cardContent.applications.title, description: cardContent.applications.description }
          ].map((card, index) => (
            <div key={index} className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10 shadow-xl hover:scale-[1.02] transition-all duration-300 hover:bg-white/10">
              <h3 className="text-lg text-cyan-300 mb-2">{card.title}</h3>
              <div className="text-gray-300 whitespace-pre-line">{card.description}</div>
            </div>
          ));
        })()}
      </div>
    </div>
  );
};

export default TransformationSection;