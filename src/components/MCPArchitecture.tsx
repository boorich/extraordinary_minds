'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Users, Bot } from 'lucide-react';

interface ArchitectureElement {
  id: 'client' | 'resources' | 'ai';
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  color: {
    primary: string;
    secondary: string;
  };
}

const architectureElements: ArchitectureElement[] = [
  {
    id: 'ai',
    title: 'AI Models',
    description: 'LLMs and specialized models',
    icon: <Bot className="w-6 h-6" />,
    features: [
      'OpenRouter integration',
      'Model selection',
      'Context management'
    ],
    color: {
      primary: 'fill-blue-600',
      secondary: 'fill-blue-500'
    }
  },
  {
    id: 'resources',
    title: 'Company Resources',
    description: 'Enterprise systems and data',
    icon: <Database className="w-6 h-6" />,
    features: [
      'Files and documents',
      'Applications and APIs',
      'Compute resources'
    ],
    color: {
      primary: 'fill-teal-600',
      secondary: 'fill-teal-500'
    }
  },
  {
    id: 'client',
    title: 'MCP Client',
    description: 'Expert user interface and tools',
    icon: <Users className="w-6 h-6" />,
    features: [
      'Interactive AI assistance',
      'Resource access controls',
      'Domain-specific tools'
    ],
    color: {
      primary: 'fill-purple-600',
      secondary: 'fill-purple-500'
    }
  }
];

const MCPArchitecture = () => {
  const [activeElement, setActiveElement] = useState<string | null>(null);

  // Helper function to create segment paths
  const createSegmentPath = (startAngle: number, endAngle: number): string => {
    const center = { x: 200, y: 200 };
    const innerRadius = 80;
    const outerRadius = 200;
    
    const innerStart = {
      x: center.x + innerRadius * Math.cos(startAngle),
      y: center.y + innerRadius * Math.sin(startAngle)
    };
    const innerEnd = {
      x: center.x + innerRadius * Math.cos(endAngle),
      y: center.y + innerRadius * Math.sin(endAngle)
    };
    const outerStart = {
      x: center.x + outerRadius * Math.cos(startAngle),
      y: center.y + outerRadius * Math.sin(startAngle)
    };
    const outerEnd = {
      x: center.x + outerRadius * Math.cos(endAngle),
      y: center.y + outerRadius * Math.sin(endAngle)
    };

    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

    return `
      M ${innerStart.x} ${innerStart.y}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerEnd.x} ${innerEnd.y}
      L ${outerEnd.x} ${outerEnd.y}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${outerStart.x} ${outerStart.y}
      Z
    `;
  };

  // Calculate segment angles
  const segmentAngles = architectureElements.map((_, index) => ({
    start: (index * 2 * Math.PI) / 3 - Math.PI / 2,
    end: ((index + 1) * 2 * Math.PI) / 3 - Math.PI / 2
  }));

  return (
    <div className="relative">
      <motion.div className="w-full aspect-square max-w-2xl mx-auto">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          {/* Outer dotted circle */}
          <circle
            cx="200"
            cy="200"
            r="205"
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeDasharray="4 4"
            className="opacity-20"
          />

          {/* Center circle - MCP Server */}
          <circle
            cx="200"
            cy="200"
            r="80"
            className="fill-cyan-600"
            strokeWidth="1"
            stroke="white"
          />
          <circle
            cx="200"
            cy="200"
            r="75"
            className="fill-cyan-500"
          />
          
          {/* Segments */}
          {architectureElements.map((element, index) => (
            <motion.path
              key={element.id}
              d={createSegmentPath(segmentAngles[index].start, segmentAngles[index].end)}
              className={`${element.color.primary} opacity-90`}
              initial={{ opacity: 0.9 }}
              animate={{
                opacity: activeElement && activeElement !== element.id ? 0.3 : 0.9
              }}
              whileHover={{ opacity: 1 }}
              onHoverStart={() => setActiveElement(element.id)}
              onHoverEnd={() => setActiveElement(null)}
            />
          ))}

          {/* Labels */}
          <text x="200" y="190" className="text-base fill-white text-center font-medium" textAnchor="middle">MCP</text>
          <text x="200" y="210" className="text-base fill-white text-center" textAnchor="middle">Server</text>
          
          {/* Segment Labels */}
          <text x="200" y="120" className="text-base fill-white text-center" textAnchor="middle">AI Models</text>
          <text x="320" y="200" className="text-base fill-white text-center" textAnchor="middle">Resources</text>
          <text x="200" y="280" className="text-base fill-white text-center" textAnchor="middle">Client</text>

          {/* Connection points */}
          {[0, 1, 2].map((_, index) => {
            const angle = (index * 2 * Math.PI) / 3 - Math.PI / 2;
            const x = 200 + 205 * Math.cos(angle);
            const y = 200 + 205 * Math.sin(angle);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                className="fill-blue-500"
              />
            );
          })}
        </svg>
      </motion.div>

      {/* Info Panel */}
      <AnimatePresence>
        {activeElement && (
          <motion.div
            className="absolute top-0 right-0 w-80 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {architectureElements.map(element => {
              if (element.id === activeElement) {
                return (
                  <div key={element.id} className="space-y-4">
                    <div className="flex items-center space-x-3">
                      {element.icon}
                      <div>
                        <h3 className="text-lg font-semibold text-white">{element.title}</h3>
                        <p className="text-sm text-gray-300">{element.description}</p>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {element.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }
              return null;
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MCPArchitecture;