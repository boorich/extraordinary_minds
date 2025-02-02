'use client';

import React from 'react';

const TransformationSection = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-light tracking-tight text-cyan-300 text-center mb-4">
        The Transformation
      </h2>
      
      {/* Text Section */}
      <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl mb-2">
        <p className="text-xl md:text-2xl leading-relaxed text-gray-300 font-light">
          Every company has valuable expertise locked in their people, processes, and data. MCP servers unlock this potential by connecting your experts with advanced AI capabilities and your existing resources. This creates a powerful synergy that enhances productivity and unlocks new possibilities.
        </p>
      </div>

      {/* Architecture Diagram */}
      <div className="py-2 mb-2">
        <svg className="w-full max-w-3xl mx-auto" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* SVG content remains the same */}
          {/* Center Circle - MCP Server */}
          <circle cx="400" cy="400" r="80" className="fill-cyan-500/20 stroke-cyan-400" strokeWidth="2" />
          <text x="400" y="395" className="text-lg fill-white text-center" textAnchor="middle">MCP</text>
          <text x="400" y="420" className="text-lg fill-white text-center" textAnchor="middle">Server</text>

          {/* Segments */}
          <path d="M400 400 L400 200 A200 200 0 0 1 600 400 Z" 
                className="fill-blue-500/20 stroke-blue-400" strokeWidth="2" />
          <path d="M400 400 L600 400 A200 200 0 0 1 400 600 Z" 
                className="fill-green-500/20 stroke-green-400" strokeWidth="2" />
          <path d="M400 400 L400 600 A200 200 0 0 1 200 400 Z" 
                className="fill-purple-500/20 stroke-purple-400" strokeWidth="2" />
          <path d="M400 400 L200 400 A200 200 0 0 1 400 200 Z" 
                className="fill-cyan-500/20 stroke-cyan-400" strokeWidth="2" />

          {/* Labels */}
          <g className="text-white">
            <text x="400" y="250" className="text-lg fill-white text-center" textAnchor="middle">LLM</text>
            <text x="420" y="280" className="text-sm fill-gray-300 text-center" textAnchor="middle">AI Capabilities</text>
            
            <text x="550" y="410" className="text-lg fill-white text-center" textAnchor="middle">Company</text>
            <text x="550" y="430" className="text-lg fill-white text-center" textAnchor="middle">Resources</text>
            <text x="550" y="450" className="text-sm fill-gray-300 text-center" textAnchor="middle">Data & Systems</text>

            <text x="400" y="550" className="text-lg fill-white text-center" textAnchor="middle">Experts</text>
            <text x="400" y="570" className="text-sm fill-gray-300 text-center" textAnchor="middle">Domain Knowledge</text>

            <text x="250" y="410" className="text-lg fill-white text-center" textAnchor="middle">Tools</text>
            <text x="250" y="430" className="text-sm fill-gray-300 text-center" textAnchor="middle">Integration Layer</text>
          </g>

          {/* Connecting Lines */}
          <g className="stroke-white/30" strokeWidth="1" strokeDasharray="4 4">
            <circle cx="400" cy="400" r="200" />
          </g>

          {/* Connection Points */}
          <circle cx="400" cy="200" r="4" className="fill-blue-400" />
          <circle cx="600" cy="400" r="4" className="fill-green-400" />
          <circle cx="400" cy="600" r="4" className="fill-purple-400" />
          <circle cx="200" cy="400" r="4" className="fill-cyan-400" />
        </svg>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10 shadow-xl hover:scale-[1.02] transition-all duration-300 hover:bg-white/10">
          <h3 className="text-lg text-cyan-300 mb-2">Seamless Integration</h3>
          <p className="text-gray-300">Connect your existing systems and resources without disruption</p>
        </div>
        <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10 shadow-xl hover:scale-[1.02] transition-all duration-300 hover:bg-white/10">
          <h3 className="text-lg text-cyan-300 mb-2">AI Enhancement</h3>
          <p className="text-gray-300">Leverage advanced LLM capabilities with your domain expertise</p>
        </div>
        <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10 shadow-xl hover:scale-[1.02] transition-all duration-300 hover:bg-white/10">
          <h3 className="text-lg text-cyan-300 mb-2">Secure Foundation</h3>
          <p className="text-gray-300">Built with enterprise-grade security and compliance in mind</p>
        </div>
      </div>
    </div>
  );
};

export default TransformationSection;