import React from 'react';
import dynamic from 'next/dynamic';
import RFQTemplateGenerator from '@/components/rfq/RFQTemplateGenerator';

export const metadata = {
  title: 'RFQ Template Generator | Vision Landing',
  description: 'Generate professional RFQ templates through an intelligent chat interface',
};

export default function RFQPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">RFQ Template Generator</h1>
      <RFQTemplateGenerator />
    </div>
  );
}