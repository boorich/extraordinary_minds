'use client';

import React, { useState, useEffect } from 'react';
import { DialoguePrompt, DialogueOption, DialogueMetrics } from '@/types/dialogue';
import { generateResponseOptions } from '@/lib/openai';
import { initialDialogues } from '@/config/dialogues';
import ProfileGenerator from '../profile/ProfileGenerator';
import { 
  Compass, 
  Lightbulb, 
  Brain, 
  Code2,
} from 'lucide-react';

interface ShipDialogueProps {
  onMetricsUpdate?: (metrics: DialogueMetrics) => void;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'technical':
      return <Code2 className="w-5 h-5 text-cyan-400" />;
    case 'philosophical':
      return <Brain className="w-5 h-5 text-cyan-400" />;
    case 'creative':
      return <Lightbulb className="w-5 h-5 text-cyan-400" />;
    case 'analytical':
      return <Compass className="w-5 h-5 text-cyan-400" />;
    default:
      return null;
  }
};

const COMPLETION_MESSAGE = "Ahoy! Ye've successfully navigated the Neural Odyssey, brave explorer!";

const ShipDialogue: React.FC<ShipDialogueProps> = ({ onMetricsUpdate }) => {
  const [currentPrompt, setCurrentPrompt] = useState<DialoguePrompt>(initialDialogues[0]);
  const [round, setRound] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<DialogueOption[]>([]);
  const [nextOptions, setNextOptions] = useState<DialogueOption[]>([]);
  const [conversationComplete, setConversationComplete] = useState(false);
  const [dialogueChoices, setDialogueChoices] = useState<DialogueOption[]>([]);
  const [showingProfile, setShowingProfile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setOptions(currentPrompt.options || currentPrompt.fallbackOptions);
  }, []);

  const handleOptionSelect = async (option: DialogueOption) => {
    if (conversationComplete || isTyping) return;

    try {
      setIsTyping(true);
      setDialogueChoices(prev => [...prev, option]);
      
      const nextRound = round + 1;
      
      if (nextRound >= 10) {
        setRound(10);
        setCurrentPrompt({
          ...currentPrompt,
          text: COMPLETION_MESSAGE
        });
        setConversationComplete(true);
        setIsTyping(false);
        
        setTimeout(() => {
          setShowingProfile(true);
        }, 2000);
        
        return;
      }
      
      const response = await generateResponseOptions({
        context: currentPrompt.context,
        previousExchanges: [{
          prompt: currentPrompt.text,
          response: option.text
        }],
        theme: currentPrompt.theme,
        constraints: currentPrompt.constraints
      });

      // Store next options before transition
      setNextOptions(response.options);

      // Start transition
      setIsTransitioning(true);

      // Update state after short delay to allow fade out
      setTimeout(() => {
        const nextPrompt: DialoguePrompt = {
          id: Date.now().toString(),
          text: response.systemResponse,
          theme: response.nextTheme,
          context: currentPrompt.context,
          constraints: currentPrompt.constraints,
          fallbackOptions: currentPrompt.fallbackOptions
        };

        setRound(nextRound);
        setCurrentPrompt(nextPrompt);
        setOptions(response.options);
        setError(null);
        setIsTyping(false);
        setIsTransitioning(false);
      }, 500);

    } catch (err) {
      console.error('Error in dialogue:', err);
      setError('Arr! The neural winds be unfavorable. Give it another shot, matey!');
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative bg-slate-800/90 rounded-lg border border-cyan-400 p-6 max-w-4xl mx-auto">
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}
        
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-cyan-400">
            <span className="pirate-font">Journey Log:</span> {round}/10
          </div>
          <div className="h-2 flex-1 mx-4 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-400 transition-all duration-500"
              style={{ width: `${(round / 10) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-6 bg-slate-700/50 p-4 rounded-lg border border-cyan-400/30">
          <p className={`text-slate-200 pirate-font text-lg transition-opacity duration-500 ${isTyping ? 'opacity-50' : 'opacity-100'}`}>
            {currentPrompt.text}
          </p>
        </div>

        {!conversationComplete && (
          <div className="relative min-h-[200px]">
            {/* Current Options */}
            <div className={`grid grid-cols-1 gap-3 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  className="text-left p-4 bg-slate-700/50 rounded border border-cyan-400/30 
                           hover:bg-slate-600/50 hover:border-cyan-400 transition-all duration-200
                           text-slate-200 hover:text-white flex items-start gap-3"
                  disabled={isTyping}
                >
                  <div className="mt-1">
                    {getIcon(option.type)}
                  </div>
                  <span>{option.text}</span>
                </button>
              ))}
            </div>

            {/* Loading Overlay */}
            {isTyping && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 backdrop-blur-sm">
                <div className="animate-pulse flex space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            )}

            {/* Next Options (for transition) */}
            {isTransitioning && (
              <div className="absolute inset-0 grid grid-cols-1 gap-3 transition-opacity duration-500 opacity-0">
                {nextOptions.map((option, index) => (
                  <button
                    key={index}
                    disabled
                    className="text-left p-4 bg-slate-700/50 rounded border border-cyan-400/30 
                             text-slate-200 flex items-start gap-3"
                  >
                    <div className="mt-1">
                      {getIcon(option.type)}
                    </div>
                    <span>{option.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showingProfile && (
        <div className="animate-fadeIn">
          <ProfileGenerator dialogueChoices={dialogueChoices} />
        </div>
      )}
    </div>
  );
};

export default ShipDialogue;