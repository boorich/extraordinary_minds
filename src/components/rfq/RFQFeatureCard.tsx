'use client';

import React from 'react';

const RFQFeatureCard = () => {
  return (
    <div className="mb-8 bg-slate-800/90 border border-cyan-400/10 rounded-xl shadow-2xl backdrop-blur-sm">
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-green-500/20 text-green-300 border border-green-500/30">
              Available
            </span>
            <div className="flex-1">
              <div className="text-white font-medium">Free RFQ Template Generator</div>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                Create professional RFQ documents through a guided conversation.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
              Beta
            </span>
            <div className="flex-1">
              <div className="text-white font-medium">Smart Validation</div>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                Get instant feedback and improvement suggestions based on industry best practices.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-slate-500/20 text-slate-300 border border-slate-500/30">
              Coming Soon
            </span>
            <div className="flex-1">
              <div className="text-white font-medium">Enterprise Enhancement</div>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                Connect your company data to create more accurate and detailed RFQs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RFQFeatureCard;