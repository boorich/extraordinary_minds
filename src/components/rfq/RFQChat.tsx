'use client';

import React, { useState } from 'react';
import { useRFQStore } from '@/lib/rfq/store';
import { RFQResponse } from '@/lib/rfq/types';
import { AlertTriangle, ChevronRight } from 'lucide-react';

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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Progress */}
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-blue-500 h-full transition-all"
          style={{ width: `${((sectionIndex + 1) / 5) * 100}%` }}
        />
      </div>

      {/* Current Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">{currentSection.name}</h2>
        
        {currentSection.prompts.map((prompt, index) => (
          <p key={index} className="mb-2 text-gray-700">{prompt}</p>
        ))}

        <form onSubmit={handleSubmit} className="mt-4">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Your response..."
          />
          
          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={previousSection}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={sectionIndex === 0}
            >
              Back
            </button>
            
            <button
              type="submit"
              disabled={isProcessing || !userInput.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
            >
              {isProcessing ? 'Processing...' : 'Next'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Data Enhancement Hints */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
          Data Enhancement Opportunities
        </h3>
        
        <div className="space-y-3">
          {currentSection.dataHints.map((hint, index) => (
            <div key={index} className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-yellow-700 text-sm">{index + 1}</span>
              </div>
              <div>
                <p className="text-gray-700">{hint}</p>
                <p className="text-sm text-gray-500">
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