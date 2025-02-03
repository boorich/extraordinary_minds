'use client';

import React, { useState } from 'react';
import { ResponsiveNetwork } from '@nivo/network';

const architectureData = {
  nodes: [
    // Core
    { id: "MCP Server", height: 2, size: 32, color: "rgb(244, 117, 96)" },
    
    // Primary categories
    { id: "AI Models", height: 1, size: 24, color: "rgb(97, 205, 187)" },
    { id: "Company Resources", height: 1, size: 24, color: "rgb(97, 205, 187)" },
    { id: "LLM Clients", height: 1, size: 24, color: "rgb(97, 205, 187)" },
    
    // AI Models subtree
    { id: "LLMs", height: 1, size: 20, color: "rgb(232, 193, 160)" },
    { id: "Domain Specific Models", height: 1, size: 20, color: "rgb(232, 193, 160)" },
    { id: "Scientific Models", height: 0, size: 12, color: "rgb(232, 193, 160)" },
    { id: "Machine Data Models", height: 0, size: 12, color: "rgb(232, 193, 160)" },
    
    // Company Resources subtree
    { id: "Directories", height: 1, size: 20, color: "rgb(232, 193, 160)" },
    { id: "Databases", height: 1, size: 20, color: "rgb(232, 193, 160)" },
    { id: "Functions", height: 1, size: 20, color: "rgb(232, 193, 160)" },
    { id: "Applications", height: 1, size: 20, color: "rgb(232, 193, 160)" },
    { id: "Files", height: 0, size: 12, color: "rgb(232, 193, 160)" },
    { id: "Entries", height: 0, size: 12, color: "rgb(232, 193, 160)" },
    { id: "API Routes", height: 0, size: 12, color: "rgb(232, 193, 160)" },
    
    // LLM Clients subtree
    { id: "MCP Tools", height: 1, size: 20, color: "rgb(232, 193, 160)" },
    { id: "Tool 1", height: 0, size: 12, color: "rgb(232, 193, 160)" },
    { id: "Tool 2", height: 0, size: 12, color: "rgb(232, 193, 160)" },
    { id: "Tool n", height: 0, size: 12, color: "rgb(232, 193, 160)" }
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
    { source: "Directories", target: "Files", distance: 30 },
    { source: "Databases", target: "Entries", distance: 30 },
    { source: "Functions", target: "API Routes", distance: 30 },
    
    // LLM Clients tree
    { source: "LLM Clients", target: "MCP Tools", distance: 50 },
    { source: "MCP Tools", target: "Tool 1", distance: 30 },
    { source: "MCP Tools", target: "Tool 2", distance: 30 },
    { source: "MCP Tools", target: "Tool n", distance: 30 }
  ]
};

const MCPArchitecture = () => {
  return (
    <div className="relative w-full aspect-square max-w-3xl mx-auto">
      <ResponsiveNetwork
        data={architectureData}
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