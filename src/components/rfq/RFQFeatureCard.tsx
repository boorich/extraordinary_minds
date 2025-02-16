'use client';

import React from 'react';

const RFQFeatureCard = () => {
  const description = `[Available] Free RFQ Template Generator: Create professional RFQ documents through a guided conversation.

[Beta] Smart Validation: Get instant feedback and improvement suggestions based on industry best practices.

[Coming Soon] Enterprise Enhancement: Connect your company data to create more accurate and detailed RFQs.`;

  // Split description into separate recommendations
  const recommendations = description.split('\n\n');

  return (
    <div className="group bg-white/5 border border-white/10 rounded-xl shadow-xl backdrop-blur-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-cyan-300 mb-4">RFQ Generator</h3>
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => {
            const [status, ...contentParts] = recommendation.split('] ');
            const content = contentParts.join('] ');
            const isAvailable = status.includes('[Available');
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-start gap-3">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                      isAvailable 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : status.includes('[Beta]')
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                    }`}
                  >
                    {status.replace('[', '').replace(']', '')}
                  </span>
                  <div className="flex-1">
                    <div className="text-gray-200 font-medium">{content.split(':')[0]}</div>
                    <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                      {content.split(':')[1]?.trim()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RFQFeatureCard;