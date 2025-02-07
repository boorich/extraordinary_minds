'use client';

import NetworkMetadataListener from './NetworkMetadataListener';

const MetadataPortal = () => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="relative w-full h-full">
        <NetworkMetadataListener />
      </div>
    </div>
  );
};

export default MetadataPortal;