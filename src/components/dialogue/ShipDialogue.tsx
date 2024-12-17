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

interface DialogueMessage {
  id: string;
  text: string;
  isUser: boolean;
}

const ShipDialogue: React.FC<ShipDialogueProps> = ({ onMetricsUpdate }) => {
  const [agent] = useState(() => new ShipAgent(shipConfig));
  const [messages, setMessages] = useState<DialogueMessage[]>([{
    id: 'initial',
    text: "Welcome aboard the Neural Voyager. What drives your exploration of these digital realms?",
    isUser: false
  }]);
  
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [round, setRound] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [showingProfile, setShowingProfile] = useState(false);
  const [dialogueChoices, setDialogueChoices] = useState<DialogueOption[]>([]);

  const handleUserInput = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isTyping) return;

    const currentInput = userInput.trim();
    setUserInput('');
    setIsTyping(true);

    // Add user message immediately
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: currentInput,
      isUser: true
    }]);

    try {
      // Track the dialogue choice for profile generation
      const choice: DialogueOption = {
        text: currentInput,
        type: 'analytical', // The agent will determine the actual type
        score: 1
      };
      setDialogueChoices(prev => [...prev, choice]);

      const nextRound = round + 1;
      if (nextRound > 10) {
        await handleConversationComplete();
        return;
      }

      // Get response from agent
      const response = await agent.generateResponse(currentInput, 'ongoing');
      
      // Add agent's response after a short delay
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: response.systemResponse,
          isUser: false
        }]);
        setRound(nextRound);
        setIsTyping(false);
      }, 500);

    } catch (err) {
      console.error('Error in dialogue:', err);
      setError('The neural winds are unfavorable. Try rephrasing your thoughts.');
      setIsTyping(false);
    }
  };

  const handleConversationComplete = async () => {
    setIsTyping(true);
    
    // Add final message
    setMessages(prev => [...prev, {
      id: 'final',
      text: "Thank you for sharing your thoughts. I've analyzed our conversation and will now generate a unique visualization that captures your essence...",
      isUser: false
    }]);

    setIsTyping(false);
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
            <span className="pirate-font">Neural Link:</span> {round}/10
          </div>
          <div className="h-2 flex-1 mx-4 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-400 transition-all duration-500"
              style={{ width: `${(round / 10) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg border ${
                message.isUser
                  ? 'bg-slate-700/30 border-cyan-400/30 ml-8'
                  : 'bg-slate-700/50 border-cyan-400/50 mr-8'
              }`}
            >
              <p className="text-slate-200">{message.text}</p>
            </div>
          ))}
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

            {isTyping && (
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

      {/* Profile Generation */}
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