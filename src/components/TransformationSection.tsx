'use client';

import React, { useEffect } from 'react';
import MCPArchitecture from './MCPArchitectureNivo';
import { NetworkData } from '@/types/network';
import { useCardStore } from '@/lib/store/cardStore';
import TransformationCard from './TransformationCard';

interface TransformationSectionProps {
  networkData?: NetworkData;
}

const TransformationSection = ({ networkData }: TransformationSectionProps) => {
  const { cardContent, updateFromNetwork } = useCardStore();
  
  console.log('=== TransformationSection: render ===');
  console.log('Current card content:', cardContent);

  useEffect(() => {
    if (networkData?.nodes?.length) {
      console.log('TransformationSection: Updating cards with network data:', {
        nodeCount: networkData.nodes.length,
        linkCount: networkData.links.length
      });
      updateFromNetwork(networkData);
    }
  }, [networkData?.nodes?.length, networkData?.links?.length, updateFromNetwork]);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="bg-slate-900/40 rounded-2xl p-4 backdrop-blur-sm border border-white/10 shadow-2xl">
        <MCPArchitecture data={networkData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <TransformationCard
            title={cardContent.rfq.title}
            description={cardContent.rfq.description}
            href="/rfq"
          />
        </div>
        {[
          { title: cardContent.data.title, description: cardContent.data.description },
          { title: cardContent.cloud.title, description: cardContent.cloud.description },
          { title: cardContent.client.title, description: cardContent.client.description }
        ].map((card, index) => (
          <TransformationCard
            key={index}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>
    </div>
  );
};

export default TransformationSection;