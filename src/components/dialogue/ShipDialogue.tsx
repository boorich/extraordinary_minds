'use client';

import React, { useState, useEffect } from 'react';
import { DialoguePrompt, DialogueOption, DialogueMetrics } from '@/types/dialogue';
import { generateResponseOptions } from '@/lib/openai';
import { initialDialogues } from '@/config/dialogues';

interface ShipDialogueProps {
  onMetricsUpdate?: (metrics: DialogueMetrics) => void;
}

const ShipDialogue: React.FC<ShipDialogueProps> = ({ onMetricsUpdate }) => {
  const [currentPrompt, setCurrentPrompt] = useState<DialoguePrompt>(initialDialogues[0]);
  const [round, setRound] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<DialogueOption[]>([]);
  const [conversationComplete, setConversationComplete] = useState(false);

  useEffect(() => {
    setOptions(currentPrompt.options || currentPrompt.fallbackOptions);
  }, []);

  const handleOptionSelect = async (option: DialogueOption) => {
    if (conversationComplete) return;

    try {
      setIsTyping(true);
      
      // Generate next response using OpenAI
      const response = await generateResponseOptions({
        context: currentPrompt.context,
        previousExchanges: [{
          prompt: currentPrompt.text,
          response: option.text
        }],
        theme: currentPrompt.theme,
        constraints: currentPrompt.constraints
      });

      // Create new prompt
      const nextPrompt: DialoguePrompt = {
        id: Date.now().toString(),
        text: response.systemResponse,
        theme: response.nextTheme,
        context: currentPrompt.context,
        constraints: currentPrompt.constraints,
        fallbackOptions: currentPrompt.fallbackOptions
      };

      // Update round counter
      const nextRound = round + 1;
      setRound(nextRound);
      
      // Check if this was the final round
      if (nextRound > 10) {
        setConversationComplete(true);
      }

      setCurrentPrompt(nextPrompt);
      setOptions(response.options);
      setError(null);

    } catch (err) {
      console.error('Error in dialogue:', err);
      setError('Something went wrong with the conversation. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="relative bg-slate-800/90 rounded-lg border border-cyan-400 p-6 max-w-4xl mx-auto">
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
          {error}
        </div>
      )}
      
      <div className="mb-4 text-center text-sm text-cyan-400">
        Question {round} of 10
      </div>

      <div className="mb-6 bg-slate-700/50 p-4 rounded-lg border border-cyan-400/30">
        {isTyping ? (
          <div className="animate-pulse flex space-x-2 justify-center">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
          </div>
        ) : (
          <p className="text-slate-200">{currentPrompt.text}</p>
        )}
      </div>

      {!isTyping && options && !conversationComplete && (
        <div className="grid grid-cols-1 gap-3">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              className="text-left p-4 bg-slate-700/50 rounded border border-cyan-400/30 
                       hover:bg-slate-600/50 hover:border-cyan-400 transition-all duration-200
                       text-slate-200 hover:text-white"
              disabled={isTyping}
            >
              {option.text}
            </button>
          ))}
        </div>
      )}

      {conversationComplete && (
        <div className="text-center p-4 bg-cyan-400/20 rounded-lg border border-cyan-400">
          <p className="text-cyan-100">Congratulations! You've completed the Neural Odyssey dialogue.</p>
        </div>
      )}
    </div>
  );
};

export default ShipDialogue;