'use client';

import React from 'react';

const TransformationSection = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <h2 className="text-3xl md:text-4xl font-light tracking-tight text-cyan-300 text-center mb-12">
        The Transformation
      </h2>
      
      {/* Text Section */}
      <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl">
        <p className="text-xl md:text-2xl leading-relaxed text-gray-300 font-light">
          Every company has valuable expertise locked in their people, processes, and data. MCP servers unlock this potential by connecting your experts with advanced AI capabilities and your existing resources. This creates a powerful synergy that enhances productivity and unlocks new possibilities.
        </p>
      </div>

      {/* Architecture Diagram */}
      <div className="p-8">
        <svg className="w-full max-w-3xl mx-auto" viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* MCP Server (Center) */}
          <rect x="350" y="200" width="100" height="100" rx="8" className="fill-cyan-500/20 stroke-cyan-400" strokeWidth="2" />
          <text x="400" y="250" className="text-lg fill-white text-center" textAnchor="middle">MCP Server</text>

          {/* LLM (Top) */}
          <rect x="350" y="50" width="100" height="80" rx="8" className="fill-blue-500/20 stroke-blue-400" strokeWidth="2" />
          <text x="400" y="95" className="text-lg fill-white text-center" textAnchor="middle">LLM</text>
          <path d="M400 130 L400 200" className="stroke-blue-400" strokeWidth="2" markerEnd="url(#arrowhead)" />

          {/* User (Left) */}
          <rect x="150" y="210" width="100" height="80" rx="8" className="fill-purple-500/20 stroke-purple-400" strokeWidth="2" />
          <text x="200" y="255" className="text-lg fill-white text-center" textAnchor="middle">User</text>
          <path d="M250 250 L350 250" className="stroke-purple-400" strokeWidth="2" markerEnd="url(#arrowhead)" />

          {/* Company Resources (Right) */}
          <rect x="550" y="210" width="100" height="80" rx="8" className="fill-green-500/20 stroke-green-400" strokeWidth="2" />
          <text x="600" y="245" className="text-sm fill-white text-center" textAnchor="middle">Company</text>
          <text x="600" y="265" className="text-sm fill-white text-center" textAnchor="middle">Resources</text>
          <path d="M450 250 L550 250" className="stroke-green-400" strokeWidth="2" markerEnd="url(#arrowhead)" />

          {/* Arrow definitions */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default TransformationSection;