'use client';

import React, { useEffect } from 'react';
import MCPArchitecture from './MCPArchitectureNivo';
import { NetworkData } from '@/types/network';
import { useCardStore } from '@/lib/store/cardStore';

interface TransformationSectionProps {
  networkData?: NetworkData;
}

const TransformationSection = ({ networkData }: TransformationSectionProps) => {
  const { cardContent, updateFromNetwork } = useCardStore();

  useEffect(() => {
    if (networkData) {
      updateFromNetwork(networkData);
    }
  }, [networkData, updateFromNetwork]);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="bg-slate-900/40 rounded-2xl p-4 backdrop-blur-sm border border-white/10 shadow-2xl">
        <MCPArchitecture data={networkData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: cardContent.rag.title, description: cardContent.rag.description },
          { title: cardContent.functions.title, description: cardContent.functions.description },
          { title: cardContent.applications.title, description: cardContent.applications.description }
        ].map((card, index) => (
          <div key={index} className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10 shadow-xl hover:scale-[1.02] transition-all duration-300 hover:bg-white/10">
            <h3 className="text-lg text-cyan-300 mb-2">{card.title}</h3>
            <div className="text-gray-300 whitespace-pre-line">{card.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransformationSection;