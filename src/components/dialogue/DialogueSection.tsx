'use client';

import React, { useState } from 'react';
import { DialogueOption } from '@/types/dialogue';

interface DialogueSectionProps {
  currentRound: number;
  totalRounds: number;
  question: string;
  options: DialogueOption[];
  onSelect: (option: DialogueOption) => void;
}

const DialogueSection: React.FC<DialogueSectionProps> = ({
  currentRound,
  totalRounds,
  question,
  options,
  onSelect,
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DialogueOption | null>(null);

  const handleOptionSelect = async (option: DialogueOption) => {
    setSelectedOption(option);
    setIsTransitioning(true);
    
    // Small delay to allow for fade out
    setTimeout(() => {
      onSelect(option);
      // Reset states after transition
      setIsTransitioning(false);
      setSelectedOption(null);
    }, 500); // Match this with CSS transition duration
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-slate-800/90 rounded-lg border border-cyan-400 p-6">
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="text-cyan-400 italic mb-2">Journey Log: {currentRound}/{totalRounds}</div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-400 transition-all duration-500"
              style={{ width: `${(currentRound / totalRounds) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h3 className="text-xl text-white pirate-font mb-2">{question}</h3>
        </div>

        {/* Options Container - Fixed height based on content */}
        <div className="relative min-h-[320px]">
          {/* Current Options */}
          <div className={`absolute inset-0 space-y-4 transition-all duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                disabled={isTransitioning}
                className={`w-full p-4 text-left rounded-lg border transition-all
                  ${selectedOption === option
                    ? 'bg-cyan-500/20 border-cyan-400'
                    : 'bg-slate-700/50 border-cyan-400/30 hover:border-cyan-400/60 hover:bg-slate-700/80'
                  }
                  ${isTransitioning ? 'pointer-events-none' : ''}
                `}
              >
                <div className="flex items-center gap-4">
                  {/* Icon container with fixed width */}
                  <div className="w-8 flex-shrink-0">
                    {option.type === 'technical' && (
                      <span className="text-cyan-400">&lt;/&gt;</span>
                    )}
                    {option.type === 'philosophical' && (
                      <span className="text-cyan-400">🧠</span>
                    )}
                    {option.type === 'creative' && (
                      <span className="text-cyan-400">💡</span>
                    )}
                    {option.type === 'analytical' && (
                      <span className="text-cyan-400">📊</span>
                    )}
                  </div>
                  <span className="text-white">{option.text}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Loading/Transition State with same structure to maintain layout */}
          <div className={`absolute inset-0 space-y-4 transition-all duration-500 ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}>
            {options.map((_, index) => (
              <div
                key={index}
                className="w-full p-4 rounded-lg border border-cyan-400/30 bg-slate-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 flex-shrink-0">
                    <div className="h-6 w-6 rounded bg-cyan-400/20 animate-pulse" />
                  </div>
                  <div className="h-6 w-full rounded bg-cyan-400/20 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogueSection;