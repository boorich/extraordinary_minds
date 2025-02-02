'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsivePie } from '@nivo/pie';
import { Database, Users, Bot } from 'lucide-react';

interface ArchitectureElement {
  id: 'clients' | 'resources' | 'ai';
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  value: number;
  details: string[];
}

const architectureElements: ArchitectureElement[] = [
  {
    id: 'ai',
    title: 'AI Models',
    description: 'Language and domain-specific models',
    icon: <Bot className="w-6 h-6" />,
    color: '#2563eb', // blue-600
    value: 1,
    details: [
      'Language Models (LLMs)',
      'Domain-specific AI',
      'Model orchestration'
    ]
  },
  {
    id: 'resources',
    title: 'Company Resources',
    description: 'Enterprise data and systems',
    icon: <Database className="w-6 h-6" />,
    color: '#0d9488', // teal-600
    value: 1,
    details: [
      'Enterprise data',
      'Internal systems',
      'API integrations'
    ]
  },
  {
    id: 'clients',
    title: 'LLM Clients',
    description: 'Expert users and tools',
    icon: <Users className="w-6 h-6" />,
    color: '#9333ea', // purple-600
    value: 1,
    details: [
      'Domain Level Experts',
      'Security Controls',
      'Integration Tools'
    ]
  }
];

const MCPArchitecture = () => {
  const [activeElement, setActiveElement] = useState<string | null>(null);

  // Center circle mouse handlers
  const handleCenterEnter = () => setActiveElement('center');
  const handleCenterLeave = () => setActiveElement(null);

  const centerDetails = {
    title: 'MCP Server',
    description: 'Central orchestration and processing',
    icon: <Database className="w-6 h-6" />,
    details: [
      'Core processing',
      'Resource orchestration',
      'Security management'
    ]
  };

  return (
    <div className="relative w-full aspect-square max-w-3xl mx-auto p-8">
      <div className="relative w-full h-full">
        <svg className="absolute inset-0 w-full h-full">
          {/* Outer dotted circle */}
          <circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeDasharray="4 4"
            className="opacity-20"
          />

          {/* Connection points */}
          {[0, 1, 2].map((_, index) => {
            const angle = (index * 2 * Math.PI) / 3 - Math.PI / 2;
            return (
              <g key={index}>
                {/* Connection point */}
                <circle
                  cx={`${50 + 48 * Math.cos(angle)}%`}
                  cy={`${50 + 48 * Math.sin(angle)}%`}
                  r="4"
                  className="fill-blue-500"
                />
                {/* Connection line */}
                <line
                  x1={`${50 + 40 * Math.cos(angle)}%`}
                  y1={`${50 + 40 * Math.sin(angle)}%`}
                  x2={`${50 + 48 * Math.cos(angle)}%`}
                  y2={`${50 + 48 * Math.sin(angle)}%`}
                  stroke="#4299e1"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="opacity-50"
                />
              </g>
            );
          })}

          {/* Center MCP Server circle - interactive */}
          <g
            onMouseEnter={handleCenterEnter}
            onMouseLeave={handleCenterLeave}
            style={{ cursor: 'pointer' }}
          >
            <circle
              cx="50%"
              cy="50%"
              r="15%"
              fill="#0891b2"
              stroke="white"
              strokeWidth="2"
              className={`transition-opacity duration-200 ${
                activeElement && activeElement !== 'center' ? 'opacity-30' : 'opacity-100'
              }`}
            />
            <circle
              cx="50%"
              cy="50%"
              r="14%"
              fill="#06b6d4"
              className={`transition-opacity duration-200 ${
                activeElement && activeElement !== 'center' ? 'opacity-30' : 'opacity-100'
              }`}
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              className="text-lg font-semibold"
            >
              MCP Server
            </text>
          </g>
        </svg>

        {/* Pie chart layer */}
        <div className="absolute inset-0">
          <ResponsivePie
            data={architectureElements}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            innerRadius={0.4}
            padAngle={0.5}
            cornerRadius={4}
            activeOuterRadiusOffset={8}
            colors={{ datum: 'data.color' }}
            borderWidth={2}
            borderColor="white"
            enableArcLabels={false}
            enableArcLinkLabels={false}
            defs={[
              {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                size: 3,
                padding: 2,
                stagger: true
              }
            ]}
            fill={[{ match: '*', id: 'dots' }]}
            onMouseEnter={(data) => {
              setActiveElement(data.id as string);
            }}
            onMouseLeave={() => {
              setActiveElement(null);
            }}
            motionConfig="gentle"
          />
        </div>

        {/* Info Panels */}
        <AnimatePresence>
          {activeElement && (
            <motion.div
              className="absolute top-0 right-0 w-72 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {activeElement === 'center' ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {centerDetails.icon}
                    <div>
                      <h3 className="text-lg font-semibold text-white">{centerDetails.title}</h3>
                      <p className="text-sm text-gray-300">{centerDetails.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {centerDetails.details.map((detail, index) => (
                      <li key={index} className="text-sm text-gray-300 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                architectureElements.map(element => {
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
                          {element.details.map((detail, index) => (
                            <li key={index} className="text-sm text-gray-300 flex items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  }
                  return null;
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MCPArchitecture;