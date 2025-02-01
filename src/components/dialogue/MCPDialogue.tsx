'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DialogueMetrics } from '@/types/dialogue';
import { MCPAgent } from '@/lib/agent/MCPAgent';
import { Character } from '@/lib/agent/types';
import mcpConfig from '@/config/mcp.character.json';

interface MCPDialogueProps {
  onMetricsUpdate?: (metrics: DialogueMetrics) => void;
}

const MCPDialogue: React.FC<MCPDialogueProps> = React.memo(({ onMetricsUpdate }) => {
  const agent = React.useMemo(() => new MCPAgent(mcpConfig as Character), []);
  
  const [conversation, setConversation] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    model?: string;
  }>>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (conversation.length > 0) {
      scrollToBottom();
    }
  }, [conversation]);

  const handleUserInput = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim() || isTyping) {
      return;
    }

    try {
      setIsTyping(true);
      setError(null);
      
      // Add user message to conversation
      setConversation(prev => [...prev, { role: 'user', content: userInput }]);
      
      // Generate response from the agent
      const response = await agent.generateResponse(userInput, 'mcp_dialogue', conversation.filter(msg => msg.role === 'user').length + 1);
      
      // Add assistant message to conversation with model info
      setConversation(prev => [...prev, { 
        role: 'assistant', 
        content: response.systemResponse,
        model: response.selectedModel // This will be added to the type definitions
      }]);
      
      // Clear input field
      setUserInput('');
      
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error('Error in dialogue:', err);
    } finally {
      setIsTyping(false);
    }
  }, [userInput, isTyping, agent, conversation.length]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  }, []);

  return (
    <div className="space-y-6" aria-label="MCP Dialogue Interface">
      <div className="relative bg-slate-800/90 rounded-lg border border-cyan-400 p-6 max-w-4xl mx-auto">
        {error && (
          <div 
            className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300"
            role="alert"
          >
            {error}
          </div>
        )}
        
        <div 
          ref={containerRef}
          className="mb-6 max-h-[500px] overflow-y-auto"
        >
          {conversation.length === 0 ? (
            <div className="bg-slate-700/50 p-4 rounded-lg border border-cyan-400/30 mb-4">
              <p className="text-slate-200 text-lg break-words whitespace-pre-wrap">
                Welcome! I'm your guide to understanding how MCP servers can transform your business. 
                How can I help you explore the potential of connecting your experts with AI and company resources?
              </p>
            </div>
          ) : (
            conversation.map((msg, index) => (
              <div 
                key={index}
                className={`mb-4 p-4 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-cyan-900/30 border border-cyan-400/30 ml-12' 
                    : 'bg-slate-700/50 border border-cyan-400/30 mr-12'
                }`}
              >
                {msg.role === 'assistant' && msg.model && (
                  <div className="text-xs text-cyan-400/70 mb-2">
                    Using model: {msg.model}
                  </div>
                )}
                <p className="text-slate-200 text-lg break-words whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
            ))
          )}
          <div ref={conversationEndRef} />
        </div>

        <form onSubmit={handleUserInput} className="relative" aria-label="User Input Form">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            className="w-full bg-slate-700/50 border border-cyan-400/30 rounded p-3 text-white 
                    focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400
                    placeholder-slate-400"
            placeholder="Ask about MCP servers..."
            disabled={isTyping}
            aria-disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !userInput.trim()}
            className={`absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1 rounded
                    ${isTyping || !userInput.trim() 
                      ? 'bg-slate-600 cursor-not-allowed' 
                      : 'water-effect hover:brightness-110'}`}
            aria-label="Send message"
          >
            Send
          </button>

          {isTyping && (
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
      </div>
    </div>
  );
});

export default MCPDialogue;