'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const ParallaxHero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <Image
          src="/cosmic-ship.jpg"
          alt="Cosmic Ship in Space"
          fill
          quality={100}
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
      </div>
      
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
        <span className="text-xl md:text-2xl text-cyan-200 mb-4 title-font">CALLING ALL</span>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 pirate-font text-cyan-400 glow px-2">
          EXTRAORDINARY MINDS
        </h1>
        <h2 className="text-lg sm:text-xl md:text-2xl text-cyan-200 title-font max-w-3xl mt-4 px-4">
          "For those who walk the path of greatness not because they should, but because they must."
        </h2>
        <button 
          onClick={() => {
            document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="mt-8 md:mt-16 p-4 water-effect text-white rounded-lg font-bold hover:brightness-110 transition-all transform hover:scale-105 glow flex items-center gap-2 cursor-pointer"
        >
          Reveal Your Destiny
          <svg 
            className="w-6 h-6 animate-bounce" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ParallaxHero;