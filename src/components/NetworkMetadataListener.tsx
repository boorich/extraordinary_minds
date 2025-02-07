import React, { useState, useEffect } from 'react';
import MetadataPopup from './MetadataPopup';
import { ComponentMetadata } from '../lib/network/types';

// Custom event for node hover
interface NodeHoverEvent extends CustomEvent {
  detail: {
    nodeId: string;
    metadata: ComponentMetadata;
    position: { x: number; y: number };
  };
}

const NetworkMetadataListener: React.FC = () => {
  const [hoverData, setHoverData] = useState<NodeHoverEvent['detail'] | null>(null);

  useEffect(() => {
    const handleNodeHover = (event: Event) => {
      const customEvent = event as NodeHoverEvent;
      setHoverData(customEvent.detail);
    };

    const handleNodeLeave = () => {
      setHoverData(null);
    };

    // Listen for custom events that will be dispatched from the graph
    window.addEventListener('network-node-hover', handleNodeHover);
    window.addEventListener('network-node-leave', handleNodeLeave);

    return () => {
      window.removeEventListener('network-node-hover', handleNodeHover);
      window.removeEventListener('network-node-leave', handleNodeLeave);
    };
  }, []);

  if (!hoverData) return null;

  return (
    <MetadataPopup
      nodeId={hoverData.nodeId}
      metadata={hoverData.metadata}
      position={hoverData.position}
      onClose={() => setHoverData(null)}
    />
  );
};

export default NetworkMetadataListener;