'use client';

import React from 'react';
import { ResponsiveNetwork } from '@nivo/network';
import { NetworkData, NetworkNode } from '@/types/network';
import { nodePatterns } from '@/lib/patterns';

import NetworkDebugPanels from './NetworkDebugPanels';
import NetworkMetadataListener from './NetworkMetadataListener';
import { useMetadataStore } from '../lib/store/metadata';

interface MCPArchitectureProps {
  data?: NetworkData;
}

const defaultData: NetworkData = {
  nodes: [
    // Core
    { id: "MCP Server", height: 2, size: 32, color: "rgb(244, 117, 96)", metadata: {
      title: "MCP Server",
      description: "Central Model Context Protocol Server",
      type: "Core System",
      details: {
        "Role": "Central Orchestrator",
        "Purpose": "Enterprise AI Integration"
      }
    }},
    
    // Primary categories
    { id: "AI Models", height: 1, size: 24, color: "rgb(97, 205, 187)", metadata: {
      title: "AI Models",
      description: "Machine Learning and AI Model Integrations",
      type: "Category",
      details: {
        "Type": "Model Hub",
        "Scope": "AI Capabilities"
      }
    }},
    { id: "Company Resources", height: 1, size: 24, color: "rgb(97, 205, 187)", metadata: {
      title: "Company Resources",
      description: "Enterprise Systems and Data Integration",
      type: "Category",
      details: {
        "Type": "Integration Hub",
        "Scope": "Enterprise Systems"
      }
    }},
    { id: "LLM Clients", height: 1, size: 24, color: "rgb(97, 205, 187)", metadata: {
      title: "LLM Clients",
      description: "User-Facing Tools and Interfaces",
      type: "Category",
      details: {
        "Type": "Client Layer",
        "Scope": "User Interaction"
      }
    }}
  ],
  links: [
    // Core connections
    { source: "MCP Server", target: "AI Models", distance: 80 },
    { source: "MCP Server", target: "Company Resources", distance: 80 },
    { source: "MCP Server", target: "LLM Clients", distance: 80 }
  ]
};

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
  console.log('MCPArchitectureNivo: Received data:', data);
  const [debugNode, setDebugNode] = React.useState<any>(null);
  const registerMetadata = useMetadataStore(state => state.registerMetadata);
  const clear = useMetadataStore(state => state.clear);

  // Register all metadata when the component mounts or data changes
  React.useEffect(() => {
    clear();
    console.log('Registering metadata for nodes:', data.nodes);
    data.nodes.forEach(node => {
      if (node.metadata) {
        console.log('Registering metadata for:', node.id, node.metadata);
        registerMetadata(node.id, node.metadata);
      }
    });
  }, [data, registerMetadata, clear]);

  return (
    <div className="relative w-full aspect-square max-w-3xl mx-auto">
      <ResponsiveNetwork
        data={data}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        linkDistance={e => e.distance || 50}
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
        onMouseEnter={(node, event) => {
          setDebugNode(node);
          console.log('Node hover:', node);
          console.log('Node data:', node.data);
          window.dispatchEvent(new CustomEvent('network-node-hover', {
            detail: {
              nodeId: node.id,
              position: { x: event.clientX, y: event.clientY }
            }
          }));
        }}
        onMouseLeave={() => {
          setDebugNode(null);
          window.dispatchEvent(new CustomEvent('network-node-leave'));
        }}
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
      <NetworkDebugPanels node={debugNode} />
    </div>
  );
};

export default MCPArchitecture;