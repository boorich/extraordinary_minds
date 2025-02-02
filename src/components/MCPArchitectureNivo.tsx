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
  details: string[];
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
    value: 1,
    details: [
      'Advanced language models',
      'Domain-specific AI',
      'Context optimization'
    ]
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
    value: 1,
    details: [
      'Secure data access',
      'System integration',
      'Resource management'
    ]
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
    value: 1,
    details: [
      'Expert interface',
      'Security controls',
      'Collaboration tools'
    ]
  }
];

const MCPArchitecture = () => {
  const [activeElement, setActiveElement] = useState<string | null>(null);

  const CenterComponent = () => (
    <g>
      <circle r="60" fill="#0891b2" strokeWidth={2} stroke="white" /> {/* cyan-600 */}
      <circle r="55" fill="#06b6d4" /> {/* cyan-500 */}
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ 
          fontSize: '16px', 
          fill: 'white', 
          fontWeight: 500,
          letterSpacing: '0.05em'
        }}
        dy="-10"
      >
        MCP
      </text>
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ 
          fontSize: '16px', 
          fill: 'white',
          letterSpacing: '0.05em'
        }}
        dy="10"
      >
        Server
      </text>
    </g>
  );

  // Calculates position for info boxes and lines
  const getInfoPosition = (index: number, total: number) => {
    const angle = ((index + 0.5) * 2 * Math.PI) / total - Math.PI / 2;
    const radius = 260; // Increased radius for outer position
    return {
      x: Math.cos(angle) * radius + 200,
      y: Math.sin(angle) * radius + 200,
      angle: (angle * 180) / Math.PI
    };
  };

  return (
    <div className="relative w-full aspect-square max-w-3xl mx-auto">
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
          cornerRadius={0}
          activeOuterRadiusOffset={8}
          colors={{ datum: 'data.color' }}
          borderWidth={2}
          borderColor="white"
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
              color: 'rgba(255, 255, 255, 0.3)',
              size: 3,
              padding: 2,
              stagger: true
            }
          ]}
          fill={[{ match: '*', id: 'dots' }]}
          motionConfig={{
            mass: 1,
            tension: 170,
            friction: 26,
            clamp: false,
            precision: 0.01,
            velocity: 0
          }}
        />

        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Connection points and info boxes */}
          {architectureElements.map((element, index) => {
            const position = getInfoPosition(index, architectureElements.length);
            const isLeft = position.x < 200;
            
            return (
              <g key={element.id}>
                {/* Connection point */}
                <circle
                  cx={position.x}
                  cy={position.y}
                  r="4"
                  className="fill-blue-500"
                />
                
                {/* Connector line */}
                <path
                  d={`M ${position.x} ${position.y} ${isLeft ? 'L 50 ' + position.y : 'L 350 ' + position.y}`}
                  stroke="#4299e1"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  fill="none"
                  className="opacity-50"
                />

                {/* Info boxes */}
                <AnimatePresence>
                  {activeElement === element.id && (
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {element.details.map((detail, detailIndex) => (
                        <g key={detailIndex} transform={`translate(${isLeft ? 20 : 280}, ${position.y + detailIndex * 30 - 30})`}>
                          <rect
                            width="200"
                            height="24"
                            rx="4"
                            fill="#1e40af"
                            className="opacity-80"
                          />
                          <text
                            x="10"
                            y="16"
                            fill="white"
                            className="text-sm"
                          >
                            {detail}
                          </text>
                        </g>
                      ))}
                    </motion.g>
                  )}
                </AnimatePresence>

                {/* Labels */}
                <text
                  x={isLeft ? 40 : 360}
                  y={position.y}
                  textAnchor={isLeft ? "start" : "end"}
                  fill="white"
                  className="text-lg font-medium"
                >
                  {element.title}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default MCPArchitecture;