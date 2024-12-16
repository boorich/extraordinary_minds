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
  // Track loading state
  const [isLoading, setIsLoading] = useState(false);
  // Track which set of options to show (current or next)
  const [showingNextOptions, setShowingNextOptions] = useState(false);
  // Keep track of current options for transition
  const [currentVisibleOptions, setCurrentVisibleOptions] = useState(options);
  // Store next options when they arrive
  const [nextOptions, setNextOptions] = useState<DialogueOption[]>([]);
  
  const handleOptionSelect = async (option: DialogueOption) => {
    // 1. Show loading overlay while keeping current options visible
    setIsLoading(true);
    
    // Store current options for transition
    setCurrentVisibleOptions(options);
    
    // Simulate network delay (remove in production)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Call the handler to get next options
    onSelect(option);
    
    // Store the new options
    setNextOptions(options);
    
    // Start transition
    setShowingNextOptions(true);
    
    // After transition completes, clean up
    setTimeout(() => {
      setIsLoading(false);
      setCurrentVisibleOptions(options);
      setShowingNextOptions(false);
      setNextOptions([]);
    }, 500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-slate-800/90 rounded-lg border border-cyan-400 p-6">
        {/* Progress */}
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
          <h3 className="text-xl text-white pirate-font">{question}</h3>
        </div>

        {/* Options Container */}
        <div className="relative">
          {/* Current Options Layer */}
          <div className={`space-y-4 transition-opacity duration-500 ${showingNextOptions ? 'opacity-0' : 'opacity-100'}`}>
            {currentVisibleOptions.map((option, index) => (
              <button
                key={`current-${index}`}
                onClick={() => handleOptionSelect(option)}
                disabled={isLoading}
                className={`w-full p-4 text-left rounded-lg border transition-all
                  bg-slate-700/50 border-cyan-400/30 hover:border-cyan-400/60 hover:bg-slate-700/80
                  ${isLoading ? 'pointer-events-none' : ''}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 flex-shrink-0">
                    {option.type === 'technical' && <span className="text-cyan-400">&lt;/&gt;</span>}
                    {option.type === 'philosophical' && <span className="text-cyan-400">🧠</span>}
                    {option.type === 'creative' && <span className="text-cyan-400">💡</span>}
                    {option.type === 'analytical' && <span className="text-cyan-400">📊</span>}
                  </div>
                  <span className="text-white">{option.text}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Next Options Layer */}
          {nextOptions.length > 0 && (
            <div className={`absolute inset-0 space-y-4 transition-opacity duration-500 
              ${showingNextOptions ? 'opacity-100' : 'opacity-0'}`}
            >
              {nextOptions.map((option, index) => (
                <button
                  key={`next-${index}`}
                  disabled={true}
                  className="w-full p-4 text-left rounded-lg border transition-all
                    bg-slate-700/50 border-cyan-400/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 flex-shrink-0">
                      {option.type === 'technical' && <span className="text-cyan-400">&lt;/&gt;</span>}
                      {option.type === 'philosophical' && <span className="text-cyan-400">🧠</span>}
                      {option.type === 'creative' && <span className="text-cyan-400">💡</span>}
                      {option.type === 'analytical' && <span className="text-cyan-400">📊</span>}
                    </div>
                    <span className="text-white">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
              <div className="flex flex-col items-center text-cyan-400">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current"></div>
                <p className="mt-4">Processing neural patterns...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DialogueSection;