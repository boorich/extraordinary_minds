import React from 'react';

const DebugPanel = ({ title, data }: { title: string; data: any }) => (
  <div className="fixed p-4 bg-gray-900/90 rounded-lg border border-blue-500/50 backdrop-blur-sm text-sm text-white max-w-sm">
    <h3 className="font-semibold mb-2">{title}</h3>
    <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-96">
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
);

const NetworkDebugPanels = ({ node }: { node: any }) => {
  if (!node) return null;

  // Separate our metadata from Nivo's node data
  const ourMetadata = node.metadata || {};
  const nivoData = {
    id: node.id,
    x: node.x,
    y: node.y,
    size: node.size,
    color: node.color,
    index: node.index,
    height: node.height,
    vx: node.vx,
    vy: node.vy,
    borderWidth: node.borderWidth,
    borderColor: node.borderColor
  };

  return (
    <>
      {/* Our metadata panel - top right */}
      <div className="fixed top-4 right-4">
        <DebugPanel title="Our Metadata" data={ourMetadata} />
      </div>
      
      {/* Nivo's node data panel - top left */}
      <div className="fixed top-4 left-4">
        <DebugPanel title="Nivo Node Data" data={nivoData} />
      </div>
    </>
  );
};

export default NetworkDebugPanels;