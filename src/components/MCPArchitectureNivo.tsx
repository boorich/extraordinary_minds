'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
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
    color: '#2563eb55',
    value: 1,
    details: [
      'Language Models (LLMs)',
      'Domain-specific AI',
      'Model orchestration'
    ]
  },
  {
    id: 'resources',
    title: 'Company\nResources',
    description: 'Enterprise data and systems',
    icon: <Database className="w-6 h-6" />,
    color: '#0d948855',
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
    color: '#9333ea55',
    value: 1,
    details: [
      'Domain Level Experts',
      'Security Controls',
      'Integration Tools'
    ]
  }
];

const MCPArchitecture = () => {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [activeElement, setActiveElement] = useState<string | null>(null);

  return (
    <div ref={ref} className="relative w-full aspect-square max-w-3xl mx-auto p-16">
      <div className="relative w-full h-full scale-[0.85]">
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

          {/* Center MCP Server circle */}
          <g
            onMouseEnter={() => setActiveElement('center')}
            onMouseLeave={() => setActiveElement(null)}
            style={{ cursor: 'pointer' }}
          >
            <circle
              cx="50%"
              cy="50%"
              r="15%"
              fill="#0891b255"
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
              fill="#06b6d455"
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
              className="text-xl font-semibold"
            >
              MCP Server
            </text>
          </g>
        </svg>

        {/* Pie chart layer */}
        <div className="absolute inset-0">
          <ResponsivePie
            data={inView ? architectureElements : []}

            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{ datum: 'data.color' }}
            borderWidth={2}
            borderColor="white"
            startAngle={-90}
            endAngle={270}
            enableArcLabels={true}
            arcLabel={d => d.data.title}
            arcLabelsComponent={({ label, style }) => {
              const lines = label.toString().split('\n');
              const transform = typeof style.transform === 'string' ? style.transform : '';
              return (
                <g transform={transform}>
                  <text
                    y={lines.length > 1 ? -8 : 0}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    className="text-base font-semibold"
                  >
                    {lines[0]}
                  </text>
                  {lines.length > 1 && (
                    <text
                      y={8}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      className="text-base font-semibold"
                    >
                      {lines[1]}
                    </text>
                  )}
                </g>
              );
            }}
            arcLabelsRadiusOffset={0.6}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="white"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={0}
            arcLabelsTextColor="white"
            layers={['arcs', 'arcLabels']}
            enableArcLinkLabels={false}
            isInteractive={true}
            tooltip={() => null}
            onMouseEnter={(data) => {
              setActiveElement(data.id as string);
            }}
            onMouseLeave={() => {
              setActiveElement(null);
            }}
            animate={inView}
            motionConfig={{
              mass: 1,
              tension: 170,
              friction: 26
            }}
          />
        </div>

        {/* Info Panel */}
        <AnimatePresence>
          {activeElement && (
            <motion.div
              className="absolute top-0 right-0 w-80 bg-blue-600/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 shadow-xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {activeElement === 'center' ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Database className="w-6 h-6 text-white" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">MCP Server</h3>
                      <p className="text-sm text-gray-300">Central orchestration and processing</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {['Core processing', 'Resource orchestration', 'Security management'].map((detail, index) => (
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