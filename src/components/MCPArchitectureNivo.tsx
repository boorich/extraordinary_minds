'use client';

import React from 'react';
import { ResponsiveNetwork } from '@nivo/network';
import { NetworkData, NetworkNode } from '@/types/network';
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

import { NodeMetadata } from '@/lib/patterns';

interface NivoNode {
  data: NetworkNode;
}

const NodeTooltip = ({ node }: { node: NivoNode }) => {
  const metadata = node.data.metadata;
  if (!metadata) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-lg">{metadata.title}</span>
      </div>
      <p className="text-sm opacity-90">{metadata.description}</p>
      <div className="pt-2">
        <div className="space-y-1">
          {metadata.details.map((detail: string, i: number) => (
            <div key={i} className="text-sm flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-blue-400"></span>
              <span>{detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MCPArchitecture = ({ data = defaultData }: MCPArchitectureProps) => {
  const [debugNode, setDebugNode] = React.useState<any>(null);

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
        onMouseEnter={(node) => setDebugNode(node)}
        onMouseLeave={() => setDebugNode(null)}
        nodeTooltip={NodeTooltip}
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
      {debugNode && (
        <div className="fixed top-4 right-4 bg-gray-900/90 p-4 rounded-lg border border-blue-500/50 backdrop-blur-sm text-sm text-white max-w-sm">
          <h3 className="font-semibold mb-2">{debugNode.id}</h3>
          <div className="space-y-2">
            {(debugNode.data.type || (debugNode.data.implementations && debugNode.data.implementations[0]?.type)) ? (
              <>
                <p className="text-blue-300 mb-1">Type: {debugNode.data.type || debugNode.data.implementations?.[0]?.type}</p>
                <p className="opacity-80 text-xs">{debugNode.data.description || debugNode.data.implementations?.[0]?.description}</p>
                <div className="mt-2 space-y-1">
                  {Object.entries(debugNode.data.details || debugNode.data.implementations?.[0]?.details || {}).map(([key, value], i) => (
                    <p key={i} className="text-xs flex items-start gap-2">
                      <span className="text-blue-400 mt-1">{key}:</span>
                      <span className="opacity-70">{value as string}</span>
                    </p>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-400">No metadata available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MCPArchitecture;