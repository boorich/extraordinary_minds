import React from 'react';
import { DialogueState } from '@/types/dialogue';

interface DialogueSummaryProps {
  state: DialogueState;
  conversations: Array<{
    question: string;
    response: string;
    score: number;
  }>;
  onRetry: () => void;
  onProceed: () => void;
}

const DialogueSummary: React.FC<DialogueSummaryProps> = ({
  state,
  conversations,
  onRetry,
  onProceed,
}) => {
  const hasPassedEvaluation = state.evaluationPassed;
  const averageScore = conversations.reduce((acc, conv) => acc + conv.score, 0) / conversations.length;

  if (!hasPassedEvaluation) {
    return (
      <div className="bg-slate-800/90 rounded-lg border border-red-500 p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" />
          <h3 className="text-red-500 text-xl font-bold">Neural Link Assessment Failed</h3>
        </div>

        <div className="space-y-2">
          <p className="text-slate-300">
            "I regret to inform you that your responses did not meet the required threshold for crew admission."
          </p>
          <p className="text-red-400 font-mono">
            Reason: {state.failureReason}
          </p>
        </div>

        <button
          onClick={onRetry}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 border border-cyan-400 
                   rounded-lg text-cyan-100 transition-colors duration-200"
        >
          Request Another Evaluation Attempt
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/90 rounded-lg border border-cyan-400 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-cyan-400 text-xl font-bold">Neural Link Assessment Complete</h3>
        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Final Score:</span>
          <span className="text-cyan-400 font-mono">{(averageScore * 100).toFixed(1)}%</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-700/50 rounded p-4 border border-cyan-400/30">
          <h4 className="text-cyan-300 mb-2">Notable Responses</h4>
          <div className="space-y-3">
            {conversations.map((conv, index) => (
              <div key={index} className="space-y-1">
                <p className="text-slate-400 text-sm">{conv.question}</p>
                <p className="text-slate-200">{conv.response}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-700/50 rounded p-4 border border-cyan-400/30">
          <h4 className="text-cyan-300 mb-2">Performance Analysis</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400">Technical Aptitude</p>
              <div className="h-2 bg-slate-600 rounded-full mt-1">
                <div 
                  className="h-full bg-cyan-400 rounded-full"
                  style={{ width: `${state.technical * 100}%` }}
                />
              </div>
            </div>
            <div>
              <p className="text-slate-400">Philosophical Depth</p>
              <div className="h-2 bg-slate-600 rounded-full mt-1">
                <div 
                  className="h-full bg-cyan-400 rounded-full"
                  style={{ width: `${state.philosophical * 100}%` }}
                />
              </div>
            </div>
            <div>
              <p className="text-slate-400">Creative Thinking</p>
              <div className="h-2 bg-slate-600 rounded-full mt-1">
                <div 
                  className="h-full bg-cyan-400 rounded-full"
                  style={{ width: `${state.creative * 100}%` }}
                />
              </div>
            </div>
            <div>
              <p className="text-slate-400">Analytical Skills</p>
              <div className="h-2 bg-slate-600 rounded-full mt-1">
                <div 
                  className="h-full bg-cyan-400 rounded-full"
                  style={{ width: `${state.analytical * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onProceed}
        className="w-full py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 
                 rounded-lg text-cyan-100 transition-colors duration-200 font-bold"
      >
        Generate Neural Explorer Profile
      </button>
    </div>
  );
};

export default DialogueSummary;