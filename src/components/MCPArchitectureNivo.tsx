'use client';

import React from 'react';
import { ResponsiveNetwork } from '@nivo/network';
import { NetworkData, NetworkNode, ComponentMetadata } from '@/types/network';
import { nodePatterns } from '@/lib/patterns';

import NetworkMetadataListener from './NetworkMetadataListener';
import { useMetadataStore } from '../lib/store/metadata';

interface MCPArchitectureProps {
  data?: NetworkData;
}

interface NivoNode {
  data: NetworkNode;
  id: string;
  metadata?: ComponentMetadata;
}

const defaultData: NetworkData = {
  nodes: [
    // Core
    { id: "MCP Server", height: 2, size: 32, color: "rgb(244, 117, 96)", metadata: {
      title: "MCP Server",
      description: "Central Model Context Protocol Server",
      type: "Core System",
      details: [
        "Central Orchestrator",
        "Enterprise AI Integration"
      ]
    }},
    
    // Primary categories
    { id: "AI Models", height: 1, size: 24, color: "rgb(97, 205, 187)", metadata: {
      title: "AI Models",
      description: "Machine Learning and AI Model Integrations",
      type: "Category",
      details: [
        "Model Hub",
        "AI Capabilities"
      ]
    }},
    { id: "Company Resources", height: 1, size: 24, color: "rgb(97, 205, 187)", metadata: {
      title: "Company Resources",
      description: "Enterprise Systems and Data Integration",
      type: "Category",
      details: [
        "Integration Hub",
        "Enterprise Systems"
      ]
    }},
    { id: "LLM Clients", height: 1, size: 24, color: "rgb(97, 205, 187)", metadata: {
      title: "LLM Clients",
      description: "User-Facing Tools and Interfaces",
      type: "Category",
      details: [
        "Client Layer",
        "User Interaction"
      ]
    }}
  ],
  links: [
    // Core connections
    { source: "MCP Server", target: "AI Models", distance: 80 },
    { source: "MCP Server", target: "Company Resources", distance: 80 },
    { source: "MCP Server", target: "LLM Clients", distance: 80 }
  ]
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
        // Disable Nivo's built-in tooltip
        nodeTooltip={null}
        theme={{}}
      />
      {/* Disable debug panels */}
      {/* <NetworkDebugPanels node={debugNode} /> */}
    </div>
  );
};

export default MCPArchitecture;