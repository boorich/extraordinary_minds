'use client';

import React, { useState, useEffect } from 'react';
import { DialoguePrompt, DialogueOption, DialogueMetrics } from '@/types/dialogue';
import { ShipAgent } from '@/lib/agent/ShipAgent';
import shipConfig from '@/config/ship.character.json';
import ProfileGenerator from '../profile/ProfileGenerator';

interface ShipDialogueProps {
  onMetricsUpdate?: (metrics: DialogueMetrics) => void;
}

interface DialogueStep {
  question: string;
  answer?: string;
}

const ShipDialogue: React.FC<ShipDialogueProps> = ({ onMetricsUpdate }) => {
  const [agent] = useState(() => new ShipAgent(shipConfig));
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

  const handleUserInput = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isTyping || isTransitioning) return;

    const currentInput = userInput.trim();
    setUserInput('');
    setIsTyping(true);

    try {
      // Track the dialogue choice for profile generation
      const choice: DialogueOption = {
        text: currentInput,
        type: 'analytical', // The agent will determine the actual type
        score: 1
      };
      setDialogueChoices(prev => [...prev, choice]);

      // Start transition
      setIsTransitioning(true);
      
      // Update current step with answer
      setCurrentStep(prev => ({
        ...prev,
        answer: currentInput
      }));

      const nextRound = round + 1;
      if (nextRound > 10) {
        await handleConversationComplete();
        return;
      }

      // Get response from agent
      const response = await agent.generateResponse(currentInput, 'ongoing');
      
      // Fade out current step
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set new question
      setCurrentStep({
        question: response.systemResponse
      });
      
      setRound(nextRound);
      setIsTyping(false);
      
      // End transition
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);

    } catch (err) {
      console.error('Error in dialogue:', err);
      setError('The neural winds are unfavorable. Try rephrasing your thoughts.');
      setIsTyping(false);
      setIsTransitioning(false);
    }
  };

  const handleConversationComplete = async () => {
    setIsTyping(true);
    setIsTransitioning(true);
    
    setCurrentStep({
      question: "Thank you for sharing your thoughts. I've analyzed our conversation and will now generate a unique visualization that captures your essence..."
    });

    setIsTyping(false);
    setTimeout(() => {
      setIsTransitioning(false);
      setShowingProfile(true);
    }, 1000);
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
            <span className="pirate-font">Neural Link:</span> {round}/10
          </div>
          <div className="h-2 flex-1 mx-4 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-400 transition-all duration-500"
              style={{ width: `${(round / 10) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-6 min-h-[100px] flex flex-col justify-center overflow-y-auto">
          <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
            {/* Question */}
            <div className="bg-slate-700/50 p-4 rounded-lg border border-cyan-400/30 mb-4">
              <p className="text-slate-200 pirate-font text-lg break-words">
                {currentStep.question}
              </p>
            </div>
            
            {/* Answer (if exists) */}
            {currentStep.answer && (
              <div className="bg-slate-700/30 p-4 rounded-lg border border-cyan-400/30 ml-8">
                <p className="text-slate-200 break-words">
                  {currentStep.answer}
                </p>
              </div>
            )}
          </div>
        </div>

        {!showingProfile && (
          <form onSubmit={handleUserInput} className="relative">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full bg-slate-700/50 border border-cyan-400/30 rounded p-3 text-white 
                       focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400
                       placeholder-slate-400"
              placeholder="Share your thoughts with the ship's AI..."
              disabled={isTyping || isTransitioning}
            />
            <button
              type="submit"
              disabled={isTyping || isTransitioning || !userInput.trim()}
              className={`absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1 rounded
                       ${isTyping || isTransitioning || !userInput.trim() 
                         ? 'bg-slate-600 cursor-not-allowed' 
                         : 'water-effect hover:brightness-110'}`}
            >
              Send
            </button>

            {(isTyping || isTransitioning) && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
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
};

export default ShipDialogue;