'use client';

import React, { useState, useEffect } from 'react';
import { DialoguePrompt, DialogueOption, DialogueMetrics } from '@/types/dialogue';
import { ShipAgent } from '@/lib/agent/ShipAgent';
import shipConfig from '@/config/ship.character.json';
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

const analyzeUserInput = (input: string): DialogueOption['type'] => {
  const patterns = {
    technical: /\b(system|code|algorithm|data|technical|how|work|process)\b/i,
    philosophical: /\b(think|believe|consciousness|reality|truth|why|mean|purpose)\b/i,
    creative: /\b(imagine|create|design|envision|dream|could|might|possible)\b/i,
    analytical: /\b(analyze|measure|evaluate|assess|pattern|compare|understand)\b/i
  };

  const matches = Object.entries(patterns).map(([type, pattern]) => ({
    type: type as DialogueOption['type'],
    matches: (input.match(pattern) || []).length
  }));

  const maxMatch = matches.reduce((max, current) => 
    current.matches > max.matches ? current : max
  , matches[0]);

  return maxMatch.matches > 0 ? maxMatch.type : 'analytical';
};

const COMPLETION_MESSAGE = "Ahoy! Ye've successfully navigated the Neural Odyssey, brave explorer!";

const ShipDialogue: React.FC<ShipDialogueProps> = ({ onMetricsUpdate }) => {
  const [agent] = useState(() => new ShipAgent(shipConfig));
  const [currentPrompt, setCurrentPrompt] = useState<DialoguePrompt>({
    id: 'initial',
    text: shipConfig.messageExamples[0].examples[0].response,
    theme: 'initial_contact',
    context: 'First interaction with a potential explorer.',
    constraints: [],
    fallbackOptions: shipConfig.messageExamples[0].examples.map(ex => ({
      text: ex.response,
      type: 'technical',
      score: 1
    }))
  });

  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [round, setRound] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showingProfile, setShowingProfile] = useState(false);
  const [dialogueChoices, setDialogueChoices] = useState<DialogueOption[]>([]);

  const handleUserInput = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isTyping) return;

    try {
      setIsTyping(true);
      setIsTransitioning(true);

      // Analyze and categorize user input
      const choice: DialogueOption = {
        text: userInput,
        type: analyzeUserInput(userInput),
        score: 1
      };
      setDialogueChoices(prev => [...prev, choice]);

      const nextRound = round + 1;
      if (nextRound >= 10) {
        handleConversationComplete();
        return;
      }

      // Get response from agent
      const response = await agent.generateResponse(userInput, currentPrompt.theme);
      
      // Update the conversation state after a short delay for transition effect
      setTimeout(() => {
        setCurrentPrompt({
          id: Date.now().toString(),
          text: response.systemResponse,
          theme: response.nextTheme,
          context: currentPrompt.context,
          constraints: [],
          fallbackOptions: []
        });

        setRound(nextRound);
        setUserInput('');
        setError(null);
        setIsTyping(false);
        setIsTransitioning(false);
      }, 500);

    } catch (err) {
      console.error('Error in dialogue:', err);
      setError('The neural winds are unfavorable. Try rephrasing your thoughts.');
      setIsTyping(false);
      setIsTransitioning(false);
    }
  };

  const handleConversationComplete = () => {
    setRound(10);
    setCurrentPrompt({
      ...currentPrompt,
      text: COMPLETION_MESSAGE
    });
    setIsTyping(false);
    setIsTransitioning(false);
    
    setTimeout(() => {
      setShowingProfile(true);
    }, 2000);
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
          <p className={`text-slate-200 pirate-font text-lg transition-opacity duration-500 ${
            isTyping ? 'opacity-50' : 'opacity-100'
          }`}>
            {currentPrompt.text}
          </p>
        </div>

        {/* User Input Area */}
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
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={isTyping || !userInput.trim()}
              className={`absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1 rounded
                       ${isTyping || !userInput.trim() 
                         ? 'bg-slate-600 cursor-not-allowed' 
                         : 'water-effect hover:brightness-110'}`}
            >
              Send
            </button>
          </form>
        )}

        {/* Loading Indicator */}
        {isTyping && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 backdrop-blur-sm">
            <div className="animate-pulse flex space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        )}
      </div>

      {/* Profile Generation */}
      {showingProfile && (
        <div className="animate-fadeIn">
          <ProfileGenerator dialogueChoices={dialogueChoices} />
        </div>
      )}
    </div>
  );
};

export default ShipDialogue;