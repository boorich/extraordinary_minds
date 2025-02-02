'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsivePie } from '@nivo/pie';
import { Database, Users, Bot } from 'lucide-react';

interface ArchitectureElement {
  id: 'client' | 'resources' | 'ai';
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  color: string;
  value: number;
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
    color: '#2563eb', // blue-600
    value: 1
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
    color: '#0d9488', // teal-600
    value: 1
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
    color: '#9333ea', // purple-600
    value: 1
  }
];

const MCPArchitecture = () => {
  const [activeElement, setActiveElement] = useState<string | null>(null);

  const CenterComponent = () => (
    <g>
      <circle r="60" fill="#0891b2" /> {/* cyan-600 */}
      <circle r="55" fill="#06b6d4" /> {/* cyan-500 */}
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fontSize: '14px', fill: 'white', fontWeight: 500 }}
        dy="-10"
      >
        MCP
      </text>
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fontSize: '14px', fill: 'white' }}
        dy="10"
      >
        Server
      </text>
    </g>
  );

  return (
    <div className="relative">
      <div className="w-full aspect-square max-w-2xl mx-auto">
        <div className="w-full h-full">
          <ResponsivePie
            data={architectureElements}
            margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
            innerRadius={0.6}
            padAngle={1}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{ datum: 'data.color' }}
            borderWidth={1}
            borderColor="rgba(255, 255, 255, 0.1)"
            enableArcLinkLabels={false}
            enableArcLabels={false}
            layers={['arcs', CenterComponent]}
            onMouseEnter={(data) => {
              setActiveElement(data.id as string);
            }}
            onMouseLeave={() => {
              setActiveElement(null);
            }}
            defs={[
              {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.1)',
                size: 4,
                padding: 1,
                stagger: true
              }
            ]}
            fill={[{ match: '*', id: 'dots' }]}
            motionConfig="gentle"
          />
        </div>
      </div>

      {/* Connection points */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {[0, 1, 2].map((_, index) => {
          const angle = (index * 2 * Math.PI) / 3 - Math.PI / 2;
          const x = 50 + 50 * Math.cos(angle);
          const y = 50 + 50 * Math.sin(angle);
          return (
            <circle
              key={index}
              cx={`${x}%`}
              cy={`${y}%`}
              r="4"
              className="fill-blue-500"
            />
          );
        })}
      </svg>

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