'use client';

import React from 'react';
import { ComponentMetadata } from '@/types/network';
import { AlertCircle, Info, Tag, Type } from 'lucide-react';

interface MetadataPopupProps {
  nodeId: string;
  metadata: ComponentMetadata;
  position?: { x: number; y: number };
  onClose?: () => void;
}

const MetadataField = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | undefined }) => {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="w-4 h-4 text-blue-400" />
      <span className="font-medium">{label}:</span>
      <span className="text-gray-300">{value}</span>
    </div>
  );
};

const MetadataPopup: React.FC<MetadataPopupProps> = ({ 
  nodeId, 
  metadata, 
  position,
  onClose 
}) => {
  const style = position ? {
    position: 'fixed',
    left: position.x,
    top: position.y,
    transform: 'translate(-50%, -100%)',
  } as const : {};

  return (
    <div 
      className="bg-gray-900/95 backdrop-blur-lg border border-blue-500/30 rounded-lg p-4 shadow-xl w-80"
      style={style}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg text-white">
          {metadata.title || nodeId}
        </h3>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        )}
      </div>

      {/* Description */}
      {metadata.description && (
        <p className="text-gray-300 text-sm mb-4">
          {metadata.description}
        </p>
      )}

      {/* Metadata Fields */}
      <div className="space-y-2 text-white">
        <MetadataField 
          icon={Type} 
          label="Type"
          value={metadata.type}
        />
        <MetadataField 
          icon={Tag} 
          label="Icon"
          value={metadata.icon}
        />
        
        {/* Details Section */}
        {metadata.details && Object.entries(metadata.details).length > 0 && (
          <div className="mt-4 pt-4 border-t border-blue-500/20">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-400" />
              Additional Details
            </h4>
            <div className="space-y-1">
              {Array.isArray(metadata.details) ? (
                // Handle array format
                metadata.details.map((detail, index) => (
                  <div key={index} className="text-sm flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                    <span className="text-gray-300">{detail}</span>
                  </div>
                ))
              ) : (
                // Handle object format
                Object.entries(metadata.details).map(([key, value]) => (
                  <div key={key} className="text-sm flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                    <span className="font-medium">{key}:</span>
                    <span className="text-gray-300">{value}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetadataPopup;