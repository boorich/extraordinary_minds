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
        <ResponsivePie
          data={inView ? architectureElements : []}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
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
          arcLabelsRadiusOffset={0.6}
          arcLabelsSkipAngle={0}
          arcLabelsTextColor="white"
          arcLabelsTextClass="text-xl font-semibold"
          layers={[
            'arcs',
            'arcLabels',
            ({ centerX, centerY }) => (
              <g transform={`translate(${centerX},${centerY})`}>
                <circle r="15%" fill="#0891b255" />
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  className="text-xl font-semibold"
                >
                  MCP Server
                </text>
              </g>
            )
          ]}
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
        />
      </div>

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
  );
};

export default MCPArchitecture;