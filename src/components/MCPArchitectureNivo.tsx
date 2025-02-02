'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsivePie } from '@nivo/pie';
import { Database, Users, Bot, Server } from 'lucide-react';

interface ArchitectureElement {
  id: 'clients' | 'resources' | 'ai';
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
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
    features: [
      'OpenRouter integration',
      'Model selection',
      'Context management'
    ],
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
    features: [
      'Files and documents',
      'Applications and APIs',
      'Compute resources'
    ],
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
    features: [
      'Domain experts',
      'Access controls',
      'Integration tools'
    ],
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

  const CenterComponent = () => (
    <g>
      <circle r="70" fill="#0891b2" strokeWidth={2} stroke="white" /> {/* cyan-600 */}
      <circle r="65" fill="#06b6d4" /> {/* cyan-500 */}
      
      {/* MCP Server Icon */}
      <Server 
        style={{
          transform: 'translate(-12px, -20px)',
          color: 'white',
        }}
      />
      
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ 
          fontSize: '18px', 
          fill: 'white', 
          fontWeight: 600,
          letterSpacing: '0.05em'
        }}
        dy="15"
      >
        MCP Server
      </text>
    </g>
  );

  return (
    <div className="relative w-full aspect-square max-w-3xl mx-auto p-8">
      <div className="w-full h-full">
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
        </svg>

        <ResponsivePie
          data={architectureElements}
          margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
          innerRadius={0.6}
          padAngle={0.5}
          cornerRadius={4}
          activeOuterRadiusOffset={8}
          colors={{ datum: 'data.color' }}
          borderWidth={2}
          borderColor="white"
          arcLabel={d => d.data.title}
          arcLabelsTextColor="white"
          arcLabelsRadiusOffset={0.65}
          arcLabelsSkipAngle={0}
          arcLabelsComponent={({ datum, label, style }) => (
            <g transform={`translate(${style.x}, ${style.y})`}>
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  fill: 'white',
                }}
              >
                {label}
              </text>
            </g>
          )}
          enableArcLinkLabels={false}
          layers={['arcs', 'arcLabels', CenterComponent]}
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
              color: 'rgba(255, 255, 255, 0.3)',
              size: 3,
              padding: 2,
              stagger: true
            }
          ]}
          fill={[{ match: '*', id: 'dots' }]}
          motionConfig="gentle"
        />

        {/* Info Panels */}
        <AnimatePresence>
          {activeElement && (
            <motion.div
              className="absolute top-0 right-0 w-72 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
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
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MCPArchitecture;