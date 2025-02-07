'use client';

import React, { useState, useEffect } from 'react';
import { useMetadataStore } from '../lib/store/metadata';
import MetadataPopup from './MetadataPopup';

interface HoverState {
  nodeId: string;
  position: { x: number; y: number };
}

const NetworkMetadataListener: React.FC = () => {
  const [hoverState, setHoverState] = useState<HoverState | null>(null);
  const getMetadata = useMetadataStore(state => state.getMetadata);

  useEffect(() => {
    const handleNodeHover = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('MetadataListener received hover event:', customEvent.detail);
      setHoverState({
        nodeId: customEvent.detail.nodeId,
        position: customEvent.detail.position
      });
    };

    const handleNodeLeave = () => {
      setHoverState(null);
    };

    window.addEventListener('network-node-hover', handleNodeHover);
    window.addEventListener('network-node-leave', handleNodeLeave);

    return () => {
      window.removeEventListener('network-node-hover', handleNodeHover);
      window.removeEventListener('network-node-leave', handleNodeLeave);
    };
  }, []);

  if (!hoverState) return null;

  const metadata = getMetadata(hoverState.nodeId);
  console.log('Listener: Got metadata for', hoverState.nodeId, ':', metadata);
  if (!metadata) return null;

  return (
    <MetadataPopup
      nodeId={hoverState.nodeId}
      metadata={metadata}
      position={hoverState.position}
      onClose={() => setHoverState(null)}
    />
  );
};

export default NetworkMetadataListener;