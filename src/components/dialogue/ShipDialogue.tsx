'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DialoguePrompt, DialogueOption, DialogueMetrics, DialogueHistoryEntry } from '@/types/dialogue';
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
  const lastInteractionTime = useRef<number>(Date.now());

  const handleOptionSelect = async (option: DialogueOption) => {
    const responseTime = Date.now() - lastInteractionTime.current;
    
    // Update metrics
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
    setHistory(prev => [...prev, {
      prompt: currentPrompt.text,
      response: option.text,
      timestamp: Date.now(),
      responseTime
    }]);

    // Find next prompt
    if (option.nextPrompt) {
      const nextPrompt = initialDialogues.find(p => p.id === option.nextPrompt);
      if (nextPrompt) {
        setIsTyping(true);
        await simulateTyping();
        setCurrentPrompt(nextPrompt);
        setIsTyping(false);
      }
    }

    lastInteractionTime.current = Date.now();
  };

  const simulateTyping = async () => {
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const calculateAverageResponseTime = (history: Array<{ responseTime: number }>) => {
    if (history.length === 0) return 0;
    const sum = history.reduce((acc, entry) => acc + entry.responseTime, 0);
    return sum / history.length;
  };

  // Get the current options to display
  const currentOptions = currentPrompt.options || currentPrompt.fallbackOptions;

  return (
    <div className="relative bg-slate-800/90 rounded-lg border border-cyan-400 p-6 max-w-4xl mx-auto my-12">
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

      {!isTyping && (
        <div className="grid grid-cols-1 gap-2">
          {currentOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              className="text-left p-3 bg-slate-700/50 rounded border border-cyan-400/30 
                       hover:bg-slate-600/50 hover:border-cyan-400 transition-all duration-200
                       text-slate-200 hover:text-white"
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