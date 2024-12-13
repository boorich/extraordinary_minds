'use client';

import React, { useEffect, useState, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface PathData {
  start: Point;
  end: Point;
  control1: Point;
  control2: Point;
}

const ConstellationPaths: React.FC = () => {
  const [paths, setPaths] = useState<PathData[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateDimensions = () => {
      const mainContent = document.getElementById('main-content');
      if (!mainContent) return;
      
      const rect = mainContent.getBoundingClientRect();
      setDimensions({
        width: rect.width,
        height: mainContent.scrollHeight
      });
    };

    const calculatePaths = () => {
      const sections = document.querySelectorAll('.mb-12');
      const mainContent = document.getElementById('main-content');
      if (!mainContent) return;

      const mainRect = mainContent.getBoundingClientRect();
      const newPaths: PathData[] = [];

      sections.forEach((section, index) => {
        if (index < sections.length - 1) {
          const currentRect = section.getBoundingClientRect();
          const nextRect = sections[index + 1].getBoundingClientRect();

          // Calculate start and end points
          const startX = currentRect.left - mainRect.left + (currentRect.width / 2);
          const startY = currentRect.bottom - mainRect.top;
          const endX = nextRect.left - mainRect.left + (nextRect.width / 2);
          const endY = nextRect.top - mainRect.top;

          // Calculate control points for the curve
          const midY = (startY + endY) / 2;
          const heightDiff = endY - startY;
          const curveIntensity = Math.min(150, heightDiff * 0.3);

          // Create curved path data
          newPaths.push({
            start: { x: startX, y: startY },
            end: { x: endX, y: endY },
            control1: { 
              x: startX + (Math.random() > 0.5 ? curveIntensity : -curveIntensity), 
              y: midY - curveIntensity / 2
            },
            control2: { 
              x: endX + (Math.random() > 0.5 ? curveIntensity : -curveIntensity), 
              y: midY + curveIntensity / 2
            }
          });
        }
      });

      setPaths(newPaths);
    };

    // Initial calculations
    calculateDimensions();
    calculatePaths();

    // Recalculate on resize and scroll
    window.addEventListener('resize', () => {
      calculateDimensions();
      calculatePaths();
    });
    window.addEventListener('scroll', calculatePaths);

    return () => {
      window.removeEventListener('resize', calculateDimensions);
      window.removeEventListener('scroll', calculatePaths);
    };
  }, []);

  if (!paths.length || !dimensions.width || !dimensions.height) {
    return null;
  }

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-visible pointer-events-none"
    >
      <svg 
        width={dimensions.width}
        height={dimensions.height}
        className="absolute top-0 left-0"
      >
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(34, 211, 238, 0.4)" />
            <stop offset="100%" stopColor="rgba(34, 211, 238, 0.1)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {paths.map((path, index) => (
          <g key={index} className="opacity-50 hover:opacity-75 transition-opacity duration-500">
            {/* Main connecting curve */}
            <path
              d={`M ${path.start.x} ${path.start.y} 
                  C ${path.control1.x} ${path.control1.y} 
                    ${path.control2.x} ${path.control2.y} 
                    ${path.end.x} ${path.end.y}`}
              stroke="url(#pathGradient)"
              strokeWidth="1"
              strokeDasharray="4,4"
              fill="none"
              filter="url(#glow)"
              className="animate-pulse"
            />
            
            {/* Start point */}
            <circle
              cx={path.start.x}
              cy={path.start.y}
              r="2"
              fill="#22d3ee"
              className="animate-ping"
            />
            
            {/* End point */}
            <circle
              cx={path.end.x}
              cy={path.end.y}
              r="2"
              fill="#22d3ee"
              className="animate-ping"
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

export default ConstellationPaths;