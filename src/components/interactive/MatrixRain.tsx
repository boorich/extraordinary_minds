'use client';

import React, { useEffect, useRef } from 'react';

const MatrixRain = () => {
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

    // Matrix character set
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()';

    // Sequential hidden letter setup
    const hiddenWord = 'autonomy';
    let currentLetterIndex = 0;
    let currentLetterLifetime = 0;
    let currentLetterPosition = { col: 0, row: 0 };
    
    // Rain drops
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    // Function to reset the current letter's position
    const resetLetterPosition = () => {
      currentLetterPosition = {
        col: Math.floor(Math.random() * (columns - 2)) + 1,
        row: Math.floor(Math.random() * ((canvas.height / fontSize) - 4)) + 2
      };
      currentLetterLifetime = 45;
    };

    // Initial letter position
    resetLetterPosition();

    // Animation
    const draw = () => {
      // Semi-transparent black background for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw rain
      ctx.font = fontSize + 'px monospace';
      for (let i = 0; i < drops.length; i++) {
        // Default matrix rain
        ctx.fillStyle = '#0fa';
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Reset drop if it reaches bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      // Handle the sequential hidden letter
      if (currentLetterLifetime > 0) {
        ctx.fillStyle = '#FF66FF';
        ctx.font = 'bold ' + fontSize + 'px monospace';
        ctx.fillText(
          hiddenWord[currentLetterIndex],
          currentLetterPosition.col * fontSize,
          currentLetterPosition.row * fontSize
        );
        
        currentLetterLifetime--;

        // When lifetime expires, move to next letter
        if (currentLetterLifetime === 0) {
          currentLetterIndex = (currentLetterIndex + 1) % hiddenWord.length;
          resetLetterPosition();
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
      className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-10"
      style={{ zIndex: 0 }}
    />
  );
};

export default MatrixRain;