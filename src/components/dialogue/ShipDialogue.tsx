'use client';

// ... (previous imports remain the same)

const ShipDialogue: React.FC<ShipDialogueProps> = React.memo(({ onMetricsUpdate }) => {
  // ... (previous state declarations remain the same)

  const handleUserInput = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent any action if we're at or beyond MAX_ROUNDS
    if (round >= MAX_ROUNDS || !userInput.trim() || isTyping || isTransitioning || dialogueComplete) {
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
      const { systemResponse, nextTheme } = await agent.generateResponse(input, currentTheme);
      
      // Update the conversation state
      setCurrentStep(prev => ({
        ...prev,
        answer: input,
      }));
      
      // Allow the transition animation to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsTransitioning(false);
      
      // Update the round counter first
      const newRound = round + 1;
      setRound(newRound);
      
      // If this was the last round, prepare for profile generation
      if (newRound === MAX_ROUNDS) {
        setDialogueComplete(true);
        explorerNameRef.current = agent.generateExplorerName();
        setCurrentStep({
          question: "Neural link analysis complete. Your unique traits have emerged. Ready to generate your explorer profile?",
          answer: input
        });
        handleConversationComplete();
      } else {
        // Otherwise, continue with the normal dialogue
        setCurrentTheme(nextTheme);
        setCurrentStep({
          question: systemResponse,
        });
      }

    } catch (err) {
      setError('Neural link interference detected. Please try again.');
      console.error('Error in dialogue:', err);
    } finally {
      setIsTyping(false);
    }
  }, [userInput, isTyping, isTransitioning, round, agent, currentTheme, dialogueComplete, handleConversationComplete]);

  // ... (rest of the component remains the same)
});

export default ShipDialogue;