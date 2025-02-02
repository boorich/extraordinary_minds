'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Users, Bot } from 'lucide-react';

interface ArchitectureElement {
  id: 'server' | 'client' | 'resources' | 'ai';
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  color: {
    fill: string;
    stroke: string;
  };
}

const architectureElements: ArchitectureElement[] = [
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
      fill: 'from-purple-500/20 to-purple-600/20',
      stroke: 'stroke-purple-400'
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
      fill: 'from-emerald-500/20 to-emerald-600/20',
      stroke: 'stroke-emerald-400'
    }
  },
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
      fill: 'from-blue-500/20 to-blue-600/20',
      stroke: 'stroke-blue-400'
    }
  }
];

const MCPArchitecture = () => {
  const [activeElement, setActiveElement] = useState<string | null>(null);

  // Framer motion variants for animations
  const segmentVariants = {
    initial: { scale: 1, opacity: 1 },
    hover: { scale: 1.02, opacity: 1 },
    inactive: { opacity: 0.5 }
  };

  const infoVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  return (
    <div className="relative">
      {/* Main visualization */}
      <motion.div className="w-full aspect-square max-w-2xl mx-auto">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          {/* Center Circle - MCP Server */}
          <motion.circle
            cx="200"
            cy="200"
            r="40"
            className="fill-cyan-500/20 stroke-cyan-400"
            strokeWidth="2"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1], transition: { duration: 2, repeat: Infinity } }}
          />
          <text x="200" y="195" className="text-base fill-white text-center" textAnchor="middle">MCP</text>
          <text x="200" y="215" className="text-base fill-white text-center" textAnchor="middle">Server</text>

          {/* Segments for each element */}
          {architectureElements.map((element, index) => {
            const angle = (index * 120 - 90) * (Math.PI / 180);
            const x = 200 + Math.cos(angle) * 120;
            const y = 200 + Math.sin(angle) * 120;

            return (
              <g key={element.id}>
                <motion.path
                  d={`M 200 200 L ${x} ${y} A 120 120 0 0 1 ${x + 120} ${y + 120}`}
                  className={`${element.color.fill} ${element.color.stroke}`}
                  strokeWidth="2"
                  variants={segmentVariants}
                  initial="initial"
                  animate={activeElement && activeElement !== element.id ? "inactive" : "initial"}
                  whileHover="hover"
                  onHoverStart={() => setActiveElement(element.id)}
                  onHoverEnd={() => setActiveElement(null)}
                />
              </g>
            );
          })}

          {/* Connection lines */}
          <circle
            cx="200"
            cy="200"
            r="120"
            fill="none"
            className="stroke-white/20"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        </svg>
      </motion.div>

      {/* Info Panel */}
      <AnimatePresence>
        {activeElement && (
          <motion.div
            className="absolute top-0 right-0 w-80 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
            variants={infoVariants}
            initial="initial"
            animate="animate"
            exit="exit"
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