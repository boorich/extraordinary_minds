'use client';

import React, { useEffect, useRef } from 'react';

const MCPDataFlow = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // MCP-specific character sets
    const llmChars = '🧠📊🔄💡💭'; // LLM operations
    const resourceChars = '📁💾📊📈🔍'; // Company resources
    const expertChars = '👤💼📝✍️💡'; // Expert activities
    
    const fontSize = 20;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Track different types of data streams
    interface DataStream {
      x: number;
      y: number;
      type: 'llm' | 'resource' | 'expert';
      speed: number;
      active: boolean;
    }

    const streams: DataStream[] = [];
    
    // Initialize streams
    for (let i = 0; i < columns; i++) {
      if (Math.random() > 0.7) {
        streams.push({
          x: i * fontSize,
          y: Math.random() * canvas.height,
          type: ['llm', 'resource', 'expert'][Math.floor(Math.random() * 3)] as 'llm' | 'resource' | 'expert',
          speed: 1 + Math.random() * 2,
          active: true
        });
      }
    }

    // Helper to get random character from set
    const getChar = (type: 'llm' | 'resource' | 'expert') => {
      const set = type === 'llm' ? llmChars : type === 'resource' ? resourceChars : expertChars;
      return set[Math.floor(Math.random() * set.length)];
    };

    // Animation
    const draw = () => {
      // Semi-transparent black background for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update streams
      streams.forEach(stream => {
        if (!stream.active) return;

        // Color based on type
        ctx.fillStyle = stream.type === 'llm' ? '#4CAF50' : // Green for LLM
                       stream.type === 'resource' ? '#2196F3' : // Blue for resources
                       '#FF9800'; // Orange for experts
        
        ctx.font = `${fontSize}px "Segoe UI Emoji"`;
        ctx.fillText(getChar(stream.type), stream.x, stream.y);

        // Update position
        stream.y += stream.speed;

        // Reset if out of bounds
        if (stream.y > canvas.height) {
          stream.y = -fontSize;
          stream.active = Math.random() > 0.2; // 80% chance to remain active
        }
      });

      // Occasionally add new streams
      if (Math.random() > 0.99 && streams.filter(s => s.active).length < columns / 2) {
        const inactiveStream = streams.find(s => !s.active);
        if (inactiveStream) {
          inactiveStream.active = true;
          inactiveStream.type = ['llm', 'resource', 'expert'][Math.floor(Math.random() * 3)] as 'llm' | 'resource' | 'expert';
          inactiveStream.y = -fontSize;
        } else {
          streams.push({
            x: Math.floor(Math.random() * columns) * fontSize,
            y: -fontSize,
            type: ['llm', 'resource', 'expert'][Math.floor(Math.random() * 3)] as 'llm' | 'resource' | 'expert',
            speed: 1 + Math.random() * 2,
            active: true
          });
        }
      }

      requestAnimationFrame(draw);
    };

    const animation = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animation);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
};

export default MCPDataFlow;