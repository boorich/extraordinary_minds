'use client';

import React from 'react';
import { ResponsiveNetwork } from '@nivo/network';
import { NetworkData } from '@/types/network';
import { nodePatterns } from '@/lib/patterns';

interface MCPArchitectureProps {
  data?: NetworkData;
}

const defaultData: NetworkData = {
  nodes: [
    // Core
    { id: "MCP Server", height: 2, size: 32, color: "rgb(244, 117, 96)", metadata: nodePatterns["MCP Server"] },
    
    // Primary categories
    { id: "AI Models", height: 1, size: 24, color: "rgb(97, 205, 187)", metadata: nodePatterns["AI Models"] },
    { id: "Company Resources", height: 1, size: 24, color: "rgb(97, 205, 187)", metadata: nodePatterns["Company Resources"] },
    { id: "LLM Clients", height: 1, size: 24, color: "rgb(97, 205, 187)", metadata: nodePatterns["LLM Clients"] },
    
    // AI Models subtree
    { id: "LLMs", height: 1, size: 20, color: "rgb(232, 193, 160)", metadata: nodePatterns["LLMs"] },
    { id: "Domain Specific Models", height: 1, size: 20, color: "rgb(232, 193, 160)", metadata: nodePatterns["Domain Specific Models"] },
    { id: "Scientific Models", height: 0, size: 12, color: "rgb(232, 193, 160)", metadata: nodePatterns["Scientific Models"] },
    { id: "Machine Data Models", height: 0, size: 12, color: "rgb(232, 193, 160)", metadata: nodePatterns["Machine Data Models"] },
    
    // Company Resources subtree
    { id: "Directories", height: 1, size: 20, color: "rgb(232, 193, 160)", metadata: nodePatterns["Directories"] },
    { id: "Databases", height: 1, size: 20, color: "rgb(232, 193, 160)", metadata: nodePatterns["Databases"] },
    { id: "Functions", height: 1, size: 20, color: "rgb(232, 193, 160)", metadata: nodePatterns["Functions"] },
    { id: "Applications", height: 1, size: 20, color: "rgb(232, 193, 160)", metadata: nodePatterns["Applications"] },
    
    // LLM Clients subtree
    { id: "MCP Tools", height: 1, size: 20, color: "rgb(232, 193, 160)", metadata: nodePatterns["MCP Tools"] },
  ],
  links: [
    // Core connections
    { source: "MCP Server", target: "AI Models", distance: 80 },
    { source: "MCP Server", target: "Company Resources", distance: 80 },
    { source: "MCP Server", target: "LLM Clients", distance: 80 },
    
    // AI Models tree
    { source: "AI Models", target: "LLMs", distance: 50 },
    { source: "AI Models", target: "Domain Specific Models", distance: 50 },
    { source: "Domain Specific Models", target: "Scientific Models", distance: 30 },
    { source: "Domain Specific Models", target: "Machine Data Models", distance: 30 },
    
    // Company Resources tree
    { source: "Company Resources", target: "Directories", distance: 50 },
    { source: "Company Resources", target: "Databases", distance: 50 },
    { source: "Company Resources", target: "Functions", distance: 50 },
    { source: "Company Resources", target: "Applications", distance: 50 },
    
    // LLM Clients tree
    { source: "LLM Clients", target: "MCP Tools", distance: 50 },
  ]
};

const MCPArchitecture = ({ data = defaultData }: MCPArchitectureProps) => {
  return (
    <div className="relative w-full aspect-square max-w-3xl mx-auto">
      <ResponsiveNetwork
        data={data}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        linkDistance={e => e.distance}
        centeringStrength={0.3}
        repulsivity={6}
        nodeSize={n => n.size}
        activeNodeSize={n => 1.5 * n.size}
        nodeColor={n => n.color}
        nodeBorderWidth={1}
        nodeBorderColor={{
          from: 'color',
          modifiers: [['darker', 0.8]]
        }}
        linkThickness={n => 2 + 2 * n.target.data.height}
        linkBlendMode="multiply"
        motionConfig="gentle"
        isInteractive={true}
        theme={{
          tooltip: {
            container: {
              background: 'rgba(59, 130, 246, 0.3)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
              padding: '24px',
              minWidth: '320px',
              color: '#ffffff'
            }
          }
        }}
      />
    </div>
  );
};

export default MCPArchitecture;