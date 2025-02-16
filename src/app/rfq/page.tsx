import React from 'react';
import RFQDialogue from '@/components/rfq/RFQDialogue';
import { NetworkMetadataListener } from '@/components/NetworkMetadataListener';

export const metadata = {
  title: 'RFQ Template Generator | Vision Landing',
  description: 'Generate professional RFQ templates through an intelligent chat interface'
};

export default function RFQPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          RFQ Template Generator
        </h1>
        <p className="text-xl text-gray-300">
          Create professional RFQ templates through a simple conversation
        </p>
      </div>

      <div className="grid gap-8">
        <RFQDialogue />
        <NetworkMetadataListener />
      </div>
    </div>
  );
}