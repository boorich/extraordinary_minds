'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DialoguePrompt, DialogueOption, DialogueMetrics, DialogueHistoryEntry } from '@/types/dialogue';
import { generateResponseOptions, analyzeResponse } from '@/lib/openai';
import { initialDialogues } from '@/config/dialogues';

interface ShipDialogueProps {
  onMetricsUpdate?: (metrics: DialogueMetrics) => void;
}

const ShipDialogue: React.FC<ShipDialogueProps> = ({ onMetricsUpdate }) => {
  const [currentPrompt, setCurrentPrompt] = useState<DialoguePrompt>(initialDialogues[0]);
  const [history, setHistory] = useState<DialogueHistoryEntry[]>([]);
  const [metrics, setMetrics] = useState<DialogueMetrics>({
    state: {
      technical: 0,
      philosophical: 0,
      creative: 0,
      analytical: 0
    },
    history: [],
    startTime: Date.now(),
    averageResponseTime: 0
  });
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastInteractionTime = useRef<number>(Date.now());
  const [options, setOptions] = useState<DialogueOption[]>([]);

  useEffect(() => {
    // Initialize with first prompt's options
    setOptions(currentPrompt.options || currentPrompt.fallbackOptions);
  }, []);

  const handleOptionSelect = async (option: DialogueOption) => {
    try {
      setIsTyping(true);
      const responseTime = Date.now() - lastInteractionTime.current;
      
      // Update metrics with the selected option's impact
      const newMetrics = {
        ...metrics,
        state: {
          ...metrics.state,
          [option.type]: metrics.state[option.type] + option.score
        },
        history: [...metrics.history, {
          prompt: currentPrompt.text,
          response: option.text,
          timestamp: Date.now(),
          responseTime
        }],
        averageResponseTime: calculateAverageResponseTime([...metrics.history, { responseTime }])
      };
      
      setMetrics(newMetrics);
      onMetricsUpdate?.(newMetrics);

      // Add to history
      const newHistory = [...history, {
        prompt: currentPrompt.text,
        response: option.text,
        timestamp: Date.now(),
        responseTime
      }];
      setHistory(newHistory);

      // Generate next prompt using OpenAI
      const generatedOptions = await generateResponseOptions({
        context: currentPrompt.context,
        previousExchanges: newHistory,
        theme: currentPrompt.theme,
        constraints: currentPrompt.constraints
      });

      // Analyze the response
      const analysis = await analyzeResponse(option.text, currentPrompt.context);

      // Create new prompt
      const nextPrompt: DialoguePrompt = {
        id: Date.now().toString(),
        text: generatedOptions.options[0].text,
        theme: analysis.nextTheme,
        context: `Following up on ${currentPrompt.theme} theme, exploring ${analysis.nextTheme}`,
        constraints: currentPrompt.constraints,
        options: generatedOptions.options
      };

      await simulateTyping();
      setCurrentPrompt(nextPrompt);
      setOptions(nextPrompt.options || nextPrompt.fallbackOptions);
      setError(null);
    } catch (err) {
      console.error('Error in dialogue:', err);
      setError('Something went wrong with the conversation. Please try again.');
      // Fall back to static options if available
      setOptions(currentPrompt.fallbackOptions);
    } finally {
      setIsTyping(false);
      lastInteractionTime.current = Date.now();
    }
  };

  const simulateTyping = async () => {
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const calculateAverageResponseTime = (history: Array<{ responseTime: number }>) => {
    if (history.length === 0) return 0;
    const sum = history.reduce((acc, entry) => acc + entry.responseTime, 0);
    return sum / history.length;
  };

  return (
    <div className="relative bg-slate-800/90 rounded-lg border border-cyan-400 p-6 max-w-4xl mx-auto my-12">
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
          {error}
        </div>
      )}
      
      <div className="mb-6 space-y-4">
        {history.map((entry, index) => (
          <div key={index} className="space-y-2">
            <div className="bg-slate-700/50 p-3 rounded-lg border border-cyan-400/30">
              <span className="text-cyan-400 text-sm">System:</span>
              <p className="text-slate-200 mt-1">{entry.prompt}</p>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg border border-cyan-400/30 ml-4">
              <span className="text-cyan-400 text-sm">You:</span>
              <p className="text-slate-200 mt-1">{entry.response}</p>
            </div>
          </div>
        ))}
        
        <div className="bg-slate-700/50 p-3 rounded-lg border border-cyan-400/30">
          <span className="text-cyan-400 text-sm">System:</span>
          <p className="text-slate-200 mt-1">
            {isTyping ? (
              <span className="animate-pulse">...</span>
            ) : (
              currentPrompt.text
            )}
          </p>
        </div>
      </div>

      {!isTyping && options && (
        <div className="grid grid-cols-1 gap-2">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              className="text-left p-3 bg-slate-700/50 rounded border border-cyan-400/30 
                       hover:bg-slate-600/50 hover:border-cyan-400 transition-all duration-200
                       text-slate-200 hover:text-white"
              disabled={isTyping}
            >
              {option.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShipDialogue;