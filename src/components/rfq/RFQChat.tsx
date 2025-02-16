'use client';

import React, { useState } from 'react';
import { useRFQStore } from '@/lib/rfq/store';
import { RFQResponse } from '@/lib/rfq/types';
import { AlertTriangle, ChevronRight, Send } from 'lucide-react';

export default function RFQChat() {
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { 
    getCurrentSection, 
    addResponse, 
    nextSection,
    previousSection,
    currentSection: sectionIndex
  } = useRFQStore();

  const currentSection = getCurrentSection();

  const analyzeResponse = async (input: string): Promise<RFQResponse> => {
    // Mock for now - will integrate with OpenRouter
    return {
      content: input,
      dataGaps: currentSection.dataHints,
      confidence: 0.8
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const analysis = await analyzeResponse(userInput);
      addResponse(currentSection.id, analysis);
      nextSection();
      setUserInput('');
    } catch (error) {
      console.error('Error processing response:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div>
        <div className="text-cyan-400 mb-2">Progress: {sectionIndex + 1}/5</div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-cyan-400 transition-all duration-500"
            style={{ width: `${((sectionIndex + 1) / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Section */}
      <div className="rounded-lg border border-cyan-400/30 bg-slate-900/50 p-6">
        <h2 className="text-xl text-white mb-4">{currentSection.name}</h2>
        
        {currentSection.prompts.map((prompt, index) => (
          <p key={index} className="mb-2 text-gray-300">{prompt}</p>
        ))}

        <form onSubmit={handleSubmit} className="mt-6">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full bg-slate-700/50 border border-cyan-400/30 rounded p-3 text-white 
                     focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400
                     placeholder-slate-400 resize-none min-h-[100px]"
            placeholder="Your response..."
            rows={4}
          />
          
          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={previousSection}
              className="px-4 py-2 text-cyan-300 hover:text-cyan-200 disabled:text-slate-600"
              disabled={sectionIndex === 0}
            >
              Back
            </button>
            
            <button
              type="submit"
              disabled={isProcessing || !userInput.trim()}
              className="flex items-center px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30
                       hover:bg-cyan-500/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  Next
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Data Enhancement Hints */}
      <div className="rounded-lg border border-cyan-400/30 bg-slate-900/50 p-6">
        <h3 className="text-lg text-cyan-300 mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Data Enhancement Opportunities
        </h3>
        
        <div className="space-y-4">
          {currentSection.dataHints.map((hint, index) => (
            <div key={index} className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-cyan-500/20 border border-cyan-500/30 
                            flex items-center justify-center mr-3 mt-0.5">
                <span className="text-cyan-300 text-sm">{index + 1}</span>
              </div>
              <div>
                <p className="text-gray-300">{hint}</p>
                <p className="text-sm text-cyan-300/70 mt-1">
                  Connect your systems via MCP to enhance this section with real data
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}