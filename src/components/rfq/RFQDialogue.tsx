'use client';

import React, { useState } from 'react';
import MCPDialogue from '@/components/dialogue/MCPDialogue';
import { RFQAgent } from '@/lib/agent/RFQAgent';
import rfqConfig from '@/config/rfq.character.json';
import { DialogueMetrics } from '@/types/dialogue';
import { NetworkUpdate } from '@/lib/network/parser';

interface RFQInsight {
  type: 'warning' | 'info' | 'success';
  message: string;
  details?: string;
}

export default function RFQDialogue() {
  const [metrics, setMetrics] = useState<DialogueMetrics | null>(null);
  const [insights, setInsights] = useState<RFQInsight[]>([]);

  const handleMetricsUpdate = (newMetrics: DialogueMetrics) => {
    setMetrics(newMetrics);
  };

  const handleNetworkUpdate = (update: NetworkUpdate) => {
    if (update.metadata?.rfq_components?.insights) {
      setInsights(update.metadata.rfq_components.insights);
    }
  };

  return (
    <div className="space-y-6">
      <MCPDialogue
        onMetricsUpdate={handleMetricsUpdate}
        onNetworkUpdate={handleNetworkUpdate}
      />

      {insights.length > 0 && (
        <div className="bg-slate-800/90 rounded-lg border border-cyan-400 p-6">
          <h2 className="text-xl text-cyan-400 mb-4">Insights & Suggestions</h2>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  insight.type === 'warning'
                    ? 'border-yellow-500/30 bg-yellow-500/10'
                    : insight.type === 'success'
                    ? 'border-green-500/30 bg-green-500/10'
                    : 'border-blue-500/30 bg-blue-500/10'
                }`}
              >
                <h3 className={`font-medium mb-1 ${
                  insight.type === 'warning'
                    ? 'text-yellow-400'
                    : insight.type === 'success'
                    ? 'text-green-400'
                    : 'text-blue-400'
                }`}>
                  {insight.message}
                </h3>
                {insight.details && (
                  <p className="text-gray-300 text-sm">{insight.details}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}