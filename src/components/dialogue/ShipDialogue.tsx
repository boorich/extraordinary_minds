'use client';

// ... (previous imports remain the same)
import DialogueSummary from './DialogueSummary';

// ... (previous code remains the same until the render part)

  return (
    <div className="space-y-6" aria-label="Neural Voyager Dialogue Interface">
      {!dialogueComplete ? (
        <div className="relative bg-slate-800/90 rounded-lg border border-cyan-400 p-6 max-w-4xl mx-auto">
          {/* ... (existing dialogue UI code) ... */}
        </div>
      ) : (
        <DialogueSummary
          state={{
            ...dialogueState,
            evaluationPassed: agent.hasPassedEvaluation(),
            failureReason: agent.hasPassedEvaluation() ? undefined : agent.getFailureReason()
          }}
          conversations={agent.getConversationDetails()}
          onRetry={() => {
            setDialogueComplete(false);
            setRound(1);
            setCurrentQuestion(agent.getNextQuestion(1));
            setShowingProfile(false);
            startTimeRef.current = Date.now();
          }}
          onProceed={handleProfileGeneration}
        />
      )}

      {showingProfile && agent.hasPassedEvaluation() && (
        <div className="animate-fadeIn">
          <ProfileGenerator 
            dialogueChoices={dialogueChoices} 
            generationPrompt={agent.getProfileGenerationPrompt()}
            explorerName={agent.generateExplorerName()}
          />
        </div>
      )}
    </div>
  );
