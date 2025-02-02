'use client';

import React from 'react';
import MCPArchitecture from './MCPArchitectureNivo';

const TransformationSection = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Text Section */}
      <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl">
        <p className="text-lg leading-relaxed text-gray-300">
          Every company has valuable expertise locked in their people, processes, and data. 
          <span className="font-semibold"> MCP</span> servers unlock this potential by connecting your experts 
          with advanced AI capabilities and your existing resources. This creates a 
          powerful synergy that enhances productivity and unlocks new possibilities.
        </p>
      </div>

      {/* Architecture Diagram */}
      <MCPArchitecture />

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