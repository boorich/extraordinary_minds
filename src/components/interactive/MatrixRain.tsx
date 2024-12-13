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

    // Rain drops
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];
    const messageDrops: { col: number, message: string, progress: number }[] = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    // Animation
    const draw = () => {
      // Semi-transparent black background for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Green text
      ctx.fillStyle = '#0fa';
      ctx.font = fontSize + 'px monospace';

      // Draw rain
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Draw character
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Reset drop if it reaches bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      // Randomly insert secret messages
      if (Math.random() > 0.997) {
        const message = secretMessages[Math.floor(Math.random() * secretMessages.length)];
        const startCol = Math.floor(Math.random() * (columns - message.length));
        messageDrops.push({
          col: startCol,
          message,
          progress: 0
        });
      }

      // Draw and update message drops
      ctx.fillStyle = '#66F0FF';
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
      className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-10"
      style={{ zIndex: 0 }}
    />
  );
};

export default MatrixRain;