'use client';

import NetworkMetadataListener from './NetworkMetadataListener';

const MetadataPortal = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="relative w-full h-full">
        <NetworkMetadataListener />
      </div>
    </div>
  );
};

export default MetadataPortal;