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
    const secretMessages = [
      'GREATNESS AWAITS',
      'BREAK THE LIMITS',
      'BEYOND BOUNDARIES',
      'DARE TO CREATE',
      'RESHAPE REALITY'
    ];

    // Sequential hidden letter setup
    const hiddenWord = 'autonomy';
    let currentLetterIndex = 0;
    let currentLetterLifetime = 0;
    let currentLetterPosition = { col: 0, row: 0 };
    const letterSize = 28; // Increased font size for hidden letters
    
    // Rain drops
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];
    const messageDrops: { col: number, message: string, progress: number }[] = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    // Function to reset the current letter's position
    const resetLetterPosition = () => {
      currentLetterPosition = {
        col: Math.floor(Math.random() * (columns - 2)) + 1, // Keep away from edges
        row: Math.floor(Math.random() * ((canvas.height / fontSize) - 4)) + 2 // Keep away from top/bottom
      };
      currentLetterLifetime = 60; // Increased visibility time
    };

    // Initial letter position
    resetLetterPosition();

    // Animation
    const draw = () => {
      // Semi-transparent black background for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Increased transparency
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw rain
      ctx.font = fontSize + 'px monospace';
      for (let i = 0; i < drops.length; i++) {
        // Default matrix rain with decreased opacity
        ctx.fillStyle = 'rgba(0, 255, 170, 0.5)'; // More transparent green
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
        // Draw glowing effect
        ctx.fillStyle = 'rgba(255, 102, 255, 0.3)'; // Outer glow
        ctx.font = 'bold ' + (letterSize + 4) + 'px monospace';
        ctx.fillText(
          hiddenWord[currentLetterIndex],
          currentLetterPosition.col * fontSize - 2,
          currentLetterPosition.row * fontSize
        );

        // Draw main letter
        ctx.fillStyle = '#FF66FF'; // Bright pink for hidden letter
        ctx.font = 'bold ' + letterSize + 'px monospace';
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

      // Draw message drops with lower frequency
      if (Math.random() > 0.998) {
        const message = secretMessages[Math.floor(Math.random() * secretMessages.length)];
        const startCol = Math.floor(Math.random() * (columns - message.length));
        messageDrops.push({
          col: startCol,
          message,
          progress: 0
        });
      }

      // Draw and update message drops
      ctx.fillStyle = 'rgba(102, 240, 255, 0.7)';
      messageDrops.forEach((drop, index) => {
        if (drop.progress < drop.message.length) {
          ctx.fillText(
            drop.message[drop.progress],
            (drop.col + drop.progress) * fontSize,
            drops[drop.col] * fontSize
          );
          drop.progress++;
        } else {
          messageDrops.splice(index, 1);
        }
      });

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
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default MatrixRain;