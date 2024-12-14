'use client';

import React, { useEffect, useState } from 'react';
import { CardSection } from './CardSection';
import ParallaxHero from './ParallaxHero';
import MatrixRain from './interactive/MatrixRain';
import HiddenChallenges from './interactive/HiddenChallenges';
import ShipsWheel from './visual/ShipsWheel';
import DigitalCursor from './visual/DigitalCursor';
import ContactModal from './contact/ContactModal';
import { sections } from '@/config/sections';

const VisionaryLanding = () => {
  const [secretsFound, setSecretsFound] = useState<string[]>([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

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

  return (
    <div className="min-h-screen cosmic-background text-slate-100">
      <DigitalCursor />
      <MatrixRain />
      <HiddenChallenges />
      <ParallaxHero />
      
      <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 relative min-h-screen" role="main">
        <div className="relative z-10">
          <div className="mb-12 md:mb-16">
            <h3 className="text-2xl md:text-3xl pirate-font text-cyan-400 mb-4 md:mb-6 glow">The Call</h3>
            <div className="bg-slate-800/80 p-4 md:p-6 rounded-lg border border-cyan-400 hover:border-cyan-300 transition-colors backdrop-blur-sm">
              <p className="text-base md:text-lg leading-relaxed">
                In every age, there are those who aren't content to accept the world as it is. The ones who see beyond the horizon. The ones who build tomorrow. If you're reading this, you might be one of them. We're not offering a job - we're offering a calling. A chance to join a band of brilliant misfits dedicated to pushing the boundaries of what's possible in autonomous systems.
              </p>
            </div>
          </div>

          {/* Social Proof Section */}
          <div className="mb-12 md:mb-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sections.credibility.map((item, index) => (
              <div 
                key={index} 
                className="bg-slate-800/80 p-4 md:p-6 rounded-lg border border-cyan-400 hover:border-cyan-300 transition-colors backdrop-blur-sm text-center"
                role="presentation"
              >
                <div className="text-cyan-400 mb-2 flex justify-center" aria-hidden="true">
                  {item.icon}
                </div>
                <div className="text-xl md:text-2xl font-bold text-white mb-1">{item.stat}</div>
                <div className="text-sm text-slate-300">{item.label}</div>
              </div>
            ))}
          </div>

          <ShipsWheel />
          <CardSection title="Is This You?" items={sections.traits} />
          <CardSection title="Our Testament" items={sections.manifesto} />

          <div className="mb-12">
            <h3 className="text-2xl md:text-3xl pirate-font text-cyan-400 mb-4 md:mb-6 glow">Kindred Spirits</h3>
            <div className="bg-slate-800/80 p-4 md:p-6 rounded-lg border border-cyan-400 hover:border-cyan-300 transition-colors backdrop-blur-sm">
              <p className="mb-4">We recognize our own:</p>
              <CardSection title="Our Crew" items={sections.crew} variant="crew" />
              <div className="flex justify-center w-full">
                <button 
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full px-6 md:px-8 py-3 md:py-4 water-effect text-white rounded-lg font-bold hover:brightness-110 transition-all transform hover:scale-105 glow"
                  aria-label="Open contact form"
                >
                  Answer the Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 md:py-6 bg-slate-800/50 border-t-2 border-cyan-400 backdrop-blur-sm relative z-10" role="contentinfo">
        <p className="pirate-font text-lg md:text-xl text-cyan-200">"For those who dare to reshape reality."</p>
      </footer>
      
      <RiddleSuccess secretsFound={secretsFound} />

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </div>
  );
};

export default VisionaryLanding;