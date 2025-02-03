'use client';

import React from 'react';
import { ResponsiveNetwork } from '@nivo/network';
import { NetworkData } from '@/types/network';

interface MCPArchitectureProps {
  data?: NetworkData;
}

const defaultData: NetworkData = {
  nodes: [
    { id: "MCP Server", height: 2, size: 32, color: "rgb(244, 117, 96)" },
    { id: "AI Models", height: 1, size: 24, color: "rgb(97, 205, 187)" },
    { id: "Company Resources", height: 1, size: 24, color: "rgb(97, 205, 187)" },
    { id: "LLM Clients", height: 1, size: 24, color: "rgb(97, 205, 187)" }
  ],
  links: [
    { source: "MCP Server", target: "AI Models", distance: 80 },
    { source: "MCP Server", target: "Company Resources", distance: 80 },
    { source: "MCP Server", target: "LLM Clients", distance: 80 }
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
        nodeColor={e => e.color}
        nodeBorderWidth={1}
        nodeBorderColor={{
          from: 'color',
          modifiers: [['darker', 0.8]]
        }}
        linkThickness={n => 2 + 2 * n.target.data.height}
        linkBlendMode="multiply"
        motionConfig="wobbly"
      />
    </div>
  );
};

export default MCPArchitecture;