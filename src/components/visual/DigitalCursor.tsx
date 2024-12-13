'use client';

import React, { useEffect, useState } from 'react';

interface Point {
  x: number;
  y: number;
  opacity: number;
}

const MAX_TRAIL_LENGTH = 15;
const TRAIL_DECAY = 0.1;

const DigitalCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<Point[]>([]);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Update trail
      setTrail(prevTrail => {
        const newPoint = { x: e.clientX, y: e.clientY, opacity: 1 };
        const updatedTrail = [...prevTrail, newPoint]
          .map(point => ({ ...point, opacity: point.opacity - TRAIL_DECAY }))
          .filter(point => point.opacity > 0);
        
        return updatedTrail.slice(-MAX_TRAIL_LENGTH);
      });

      // Check if cursor is over a clickable element
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A'
      );
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <style jsx global>{`
        body * {
          cursor: none !important;
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none z-50">
        {/* Trail */}
        {trail.map((point, index) => (
          <div
            key={index}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: point.x,
              top: point.y,
              transform: 'translate(-50%, -50%)',
              opacity: point.opacity,
              backgroundColor: 'rgba(34, 211, 238, 0.5)',
            }}
          />
        ))}
        
        {/* Main cursor */}
        <div
          className="absolute w-8 h-8 mix-blend-screen transition-transform duration-150"
          style={{
            left: position.x,
            top: position.y,
            transform: `translate(-50%, -50%) scale(${isPointer ? 1.2 : 1})`,
          }}
        >
          <svg 
            viewBox="0 0 24 24" 
            fill="none"
            className="w-full h-full"
          >
            <circle
              cx="12"
              cy="12"
              r="8"
              stroke="#22d3ee"
              strokeWidth="1"
              className="animate-pulse"
            />
            <circle
              cx="12"
              cy="12"
              r="4"
              fill="#22d3ee"
              className={isPointer ? "animate-ping" : ""}
            />
            {isPointer && (
              <>
                <line x1="12" y1="2" x2="12" y2="6" stroke="#22d3ee" strokeWidth="1" />
                <line x1="12" y1="18" x2="12" y2="22" stroke="#22d3ee" strokeWidth="1" />
                <line x1="2" y1="12" x2="6" y2="12" stroke="#22d3ee" strokeWidth="1" />
                <line x1="18" y1="12" x2="22" y2="12" stroke="#22d3ee" strokeWidth="1" />
              </>
            )}
          </svg>
        </div>
      </div>
    </>
  );
};

export default DigitalCursor;