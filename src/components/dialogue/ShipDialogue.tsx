'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DialoguePrompt, DialogueOption, DialogueMetrics } from '@/types/dialogue';
import { ShipAgent } from '@/lib/agent/ShipAgent';
import { Character } from '@/lib/agent/types';
import shipConfig from '@/config/ship.character.json';
import ProfileGenerator from '../profile/ProfileGenerator';

interface ShipDialogueProps {
  onMetricsUpdate?: (metrics: DialogueMetrics) => void;
}

interface DialogueStep {
  question: string;
  answer?: string;
}

const ShipDialogue: React.FC<ShipDialogueProps> = React.memo(({ onMetricsUpdate }) => {
  const agent = React.useMemo(() => new ShipAgent(shipConfig as Character), []);
  
  const [currentStep, setCurrentStep] = useState<DialogueStep>({
    question: "Welcome aboard the Neural Voyager. What drives your exploration of these digital realms?"
  });
  
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [round, setRound] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [showingProfile, setShowingProfile] = useState(false);
  const [dialogueChoices, setDialogueChoices] = useState<DialogueOption[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const questionRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState('auto');

  useEffect(() => {
    if (questionRef.current) {
      requestAnimationFrame(() => {
        const scrollHeight = questionRef.current?.scrollHeight || 0;
        setContainerHeight(`${scrollHeight + 40}px`);
      });
    }
  }, [currentStep.question]);

  const handleUserInput = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim() || isTyping || isTransitioning) {
      return;
    }

    try {
      setIsTyping(true);
      setError(null);
      setIsTransitioning(true);
      
      // Store the current input and clear the field
      const input = userInput;
      setUserInput('');
      
      // Generate response from the agent
      const response = await agent.generateResponse(input);
      
      // Update the conversation state
      setCurrentStep(prev => ({
        ...prev,
        answer: input,
      }));
      
      // Allow the transition animation to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsTransitioning(false);
      
      // Update with the new question
      setCurrentStep({
        question: response,
      });
      
      // Update the round counter
      setRound(prev => {
        const newRound = prev + 1;
        if (newRound > 10) {
          handleConversationComplete();
        }
        return newRound;
      });

    } catch (err) {
      setError('Apologies, but our neural link seems to be experiencing interference. Please try again.');
      console.error('Error in dialogue:', err);
    } finally {
      setIsTyping(false);
    }
  }, [userInput, isTyping, isTransitioning, round, agent]);

  const handleConversationComplete = useCallback(async () => {
    try {
      setShowingProfile(true);
      const choices = await agent.generateDynamicOptions();
      setDialogueChoices(choices);
      
      if (onMetricsUpdate) {
        onMetricsUpdate({
          rounds: round,
          choices: choices,
        });
      }
    } catch (err) {
      console.error('Error generating profile:', err);
      setError('Unable to generate your neural profile at this time.');
    }
  }, [round, agent, onMetricsUpdate]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  }, []);

  return (
    <div className="space-y-6" aria-label="Neural Voyager Dialogue Interface">
      <div className="relative bg-slate-800/90 rounded-lg border border-cyan-400 p-6 max-w-4xl mx-auto">
        {error && (
          <div 
            className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300"
            role="alert"
          >
            {error}
          </div>
        )}
        
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-cyan-400">
            <span className="pirate-font">Neural Link:</span> {round}/10
          </div>
          <div className="h-2 flex-1 mx-4 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-400 transition-all duration-500"
              style={{ width: `${(round / 10) * 100}%` }}
            />
          </div>
        </div>

        <div 
          ref={containerRef}
          className="mb-6 flex flex-col justify-center overflow-visible"
          style={{ 
            minHeight: containerHeight,
            transition: 'min-height 0.3s ease-in-out'
          }}
        >
          <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
            <div className="bg-slate-700/50 p-4 rounded-lg border border-cyan-400/30 mb-4">
              <p 
                ref={questionRef}
                className="text-slate-200 pirate-font text-lg break-words whitespace-pre-wrap"
              >
                {currentStep.question}
              </p>
            </div>
            
            {currentStep.answer && (
              <div className="bg-slate-700/30 p-4 rounded-lg border border-cyan-400/30 ml-8">
                <p className="text-slate-200 break-words whitespace-pre-wrap">
                  {currentStep.answer}
                </p>
              </div>
            )}
          </div>
        </div>

        {!showingProfile && (
          <form onSubmit={handleUserInput} className="relative" aria-label="User Input Form">
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              className="w-full bg-slate-700/50 border border-cyan-400/30 rounded p-3 text-white 
                       focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400
                       placeholder-slate-400"
              placeholder="Share your thoughts with the ship's AI..."
              disabled={isTyping || isTransitioning}
              aria-disabled={isTyping || isTransitioning}
            />
            <button
              type="submit"
              disabled={isTyping || isTransitioning || !userInput.trim()}
              className={`absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1 rounded
                       ${isTyping || isTransitioning || !userInput.trim() 
                         ? 'bg-slate-600 cursor-not-allowed' 
                         : 'water-effect hover:brightness-110'}`}
              aria-label="Send message"
            >
              Send
            </button>

            {(isTyping || isTransitioning) && (
              <div 
                className="absolute left-3 top-1/2 -translate-y-1/2" 
                aria-live="polite" 
                aria-label="Processing response"
              >
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping delay-75"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping delay-150"></div>
                </div>
              </div>
            )}
          </form>
        )}
      </div>

      {showingProfile && (
        <div className="animate-fadeIn">
          <ProfileGenerator 
            dialogueChoices={dialogueChoices} 
            generationPrompt={agent.getProfileGenerationPrompt()}
          />
        </div>
      )}
    </div>
  );
});

export default ShipDialogue;