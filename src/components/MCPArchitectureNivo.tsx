'use client';

import React from 'react';
import { ResponsiveNetwork } from '@nivo/network';
import { NetworkData, NetworkNode } from '@/types/network';
import { nodePatterns } from '@/lib/patterns';
import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface TooltipProps {
  node: NetworkNode;
  x: number;
  y: number;
}

const NodeTooltip = ({ node, x, y }: TooltipProps) => {
  if (!node.metadata) return null;

  const Icon = node.metadata.icon ? Icons[node.metadata.icon as keyof typeof Icons] as LucideIcon : null;

  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-blue-950/95 backdrop-blur rounded-lg p-4 shadow-xl border border-blue-500/30 text-white -translate-x-1/2 -translate-y-full mb-2 min-w-[280px]">
        <div className="space-y-4 max-w-xs">
          <div className="flex items-center gap-3">
            {Icon && <Icon className="w-6 h-6 text-blue-400" />}
            <div>
              <h3 className="text-lg font-semibold text-white">{node.metadata.title}</h3>
              <p className="text-sm text-blue-200">{node.metadata.description}</p>
            </div>
          </div>
          <ul className="space-y-2">
            {node.metadata.details.map((detail, index) => (
              <li key={index} className="text-sm text-blue-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

const MCPArchitecture = ({ data = defaultData }: MCPArchitectureProps) => {
  const [tooltip, setTooltip] = React.useState<TooltipProps | null>(null);

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
        enableNodeTooltip={false}
        onMouseMove={(node, event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          setTooltip({
            node: node.data,
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top,
          });
        }}
        onMouseLeave={() => setTooltip(null)}
      />
      <AnimatePresence>
        {tooltip && <NodeTooltip {...tooltip} />}
      </AnimatePresence>
    </div>
  );
};

export default MCPArchitecture;