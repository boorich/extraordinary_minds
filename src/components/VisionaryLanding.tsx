'use client';

import React, { useEffect, useState } from 'react';
import ParallaxHero from './ParallaxHero';
import MatrixRain from './interactive/MatrixRain';
import HiddenChallenges from './interactive/HiddenChallenges';
import ShipsWheel from './visual/ShipsWheel';
import DigitalCursor from './visual/DigitalCursor';

const VisionaryLanding = () => {
  const [secretsFound, setSecretsFound] = useState<string[]>([]);

  useEffect(() => {
    const handleSecretFound = (event: CustomEvent) => {
      setSecretsFound(prev => {
        if (['first_word', 'second_word', 'third_word'].includes(event.detail.type) &&
            !prev.includes(event.detail.type)) {
          return [...prev, event.detail.type];
        }
        return prev;
      });
    };

    document.addEventListener('secretFound', handleSecretFound as EventListener);
    return () => {
      document.removeEventListener('secretFound', handleSecretFound as EventListener);
    };
  }, []);

  const CardSection = ({ title, items, variant = "default" }: { 
    title: string; 
    items: any[];
    variant?: "default" | "crew";
  }) => (
    <div className="mb-12">
      {title && <h3 className="text-3xl pirate-font text-cyan-400 mb-6 glow">{title}</h3>}
      <div className="grid gap-4">
        {variant === "crew" ? (
          <ul className="space-y-4">
            {items.map((item, index) => (
              <li key={index} className="bg-slate-800/80 p-4 rounded-lg border border-cyan-400 hover:border-cyan-300 transition-colors backdrop-blur-sm">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          items.map((item, index) => (
            <div key={index} className="bg-slate-800/80 p-6 rounded-lg border border-cyan-400 hover:border-cyan-300 transition-colors backdrop-blur-sm">
              <h4 className="font-bold text-lg mb-2 title-font text-cyan-200">{item.title}</h4>
              <p className="text-slate-300">{item.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const sections = {
    traits: [
      {
        title: "The Obsessed",
        description: "You've been called crazy. Mad. Obsessive. Because you see what others can't, and you'll spend countless nights bringing those visions to life. Not for glory, but because those ideas consume you."
      },
      {
        title: "The Relentless",
        description: "While others seek comfort, you seek challenges. Your greatest achievements aren't your past successes, but the impossible problems you're solving right now."
      }
    ],
    manifesto: [
      {
        title: "Our Mission",
        description: "To unite the extraordinary few who don't just push boundaries - they ignore them entirely. We're building autonomous systems that will reshape reality itself. Not because it's profitable, but because it's the greatest challenge we can imagine."
      },
      {
        title: "The Code",
        description: "Excellence isn't our goal - it's our baseline. We reject mediocrity in all its forms. Every line of code, every system design, every decision must push the boundaries of what's possible."
      },
      {
        title: "The Promise",
        description: "Here, you'll find your tribe. Other brilliantly obsessed minds who understand that true greatness comes not from chasing profits, but from the relentless pursuit of excellence."
      }
    ],
    crew: [
      "The midnight architect who can't sleep because the perfect solution is almost within reach",
      "The visionary who sees the matrix in their dreams and wakes up with breakthrough algorithms",
      "The perpetual learner who devours knowledge not for acclaim, but for the sheer joy of understanding",
      "The quiet genius whose greatest satisfaction comes from solving the 'impossible' problem"
    ]
  };

  return (
    <div className="min-h-screen cosmic-background text-slate-100">
      <DigitalCursor />
      <MatrixRain />
      <HiddenChallenges />
      <ParallaxHero />
      
      <main id="main-content" className="max-w-4xl mx-auto px-6 py-24 relative min-h-screen">
        <div className="relative z-10">
          <div className="mb-16">
            <h3 className="text-3xl pirate-font text-cyan-400 mb-6 glow">The Call</h3>
            <div className="bg-slate-800/80 p-6 rounded-lg border border-cyan-400 hover:border-cyan-300 transition-colors backdrop-blur-sm">
              <p className="text-lg leading-relaxed">
                In every age, there are those who aren't content to accept the world as it is. The ones who see beyond the horizon. The ones who build tomorrow. If you're reading this, you might be one of them. We're not offering a job - we're offering a calling. A chance to join a band of brilliant misfits dedicated to pushing the boundaries of what's possible in autonomous systems.
              </p>
            </div>
          </div>

          <ShipsWheel />
          <CardSection title="Is This You?" items={sections.traits} />
          <CardSection title="Our Testament" items={sections.manifesto} />

          <div className="mb-12">
            <h3 className="text-3xl pirate-font text-cyan-400 mb-6 glow">Kindred Spirits</h3>
            <div className="bg-slate-800/80 p-6 rounded-lg border border-cyan-400 hover:border-cyan-300 transition-colors backdrop-blur-sm">
              <p className="mb-4">We recognize our own:</p>
              <CardSection title="Our Crew" items={sections.crew} variant="crew" />
              <button 
                onClick={() => alert("If you know, you know. Show us what drives you: manifest@autonomousfrontier.com")}
                className="mt-6 px-8 py-4 water-effect text-white rounded-lg font-bold hover:brightness-110 transition-all transform hover:scale-105 glow"
              >
                Answer the Call
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 bg-slate-800/50 border-t-2 border-cyan-400 backdrop-blur-sm relative z-10">
        <p className="pirate-font text-xl text-cyan-200">"For those who dare to reshape reality."</p>
      </footer>
      
      {secretsFound.length > 0 && (
        <div className="fixed bottom-4 right-4 text-cyan-400 text-sm animate-fade-in">
          Discoveries: {secretsFound.length}/3
        </div>
      )}
    </div>
  );
};

export default VisionaryLanding;