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

  return (
    <div className={`bg-slate-800/90 rounded-lg border ${hasPassedEvaluation ? 'border-cyan-400' : 'border-red-500'} p-6 space-y-6`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`h-3 w-3 ${hasPassedEvaluation ? 'bg-cyan-400' : 'bg-red-500'} rounded-full animate-pulse`} />
          <h3 className={`${hasPassedEvaluation ? 'text-cyan-400' : 'text-red-500'} text-xl font-bold`}>
            {hasPassedEvaluation ? 'Neural Link Assessment Complete' : 'Neural Link Assessment Failed'}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Final Score:</span>
          <span className={`${hasPassedEvaluation ? 'text-cyan-400' : 'text-red-400'} font-mono`}>
            {(averageScore * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {!hasPassedEvaluation && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-slate-300 mb-2">
            "I regret to inform you that your responses did not meet the required threshold for crew admission."
          </p>
          <p className="text-red-400 font-mono">
            Reason: {state.failureReason}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-slate-700/50 rounded p-4 border border-cyan-400/30">
          <h4 className="text-cyan-300 mb-2">Response Analysis</h4>
          <div className="space-y-3">
            {conversations.map((conv, index) => (
              <div key={index} className="space-y-2 p-3 bg-slate-800/50 rounded">
                <div className="flex justify-between items-center">
                  <p className="text-slate-400 text-sm font-medium">Round {index + 1}</p>
                  <span className={`text-sm font-mono ${
                    conv.score >= 0.4 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {(conv.score * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-slate-400 text-sm italic">{conv.question}</p>
                <p className="text-slate-200">{conv.response}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-700/50 rounded p-4 border border-cyan-400/30">
          <h4 className="text-cyan-300 mb-2">Performance Analysis</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between">
                <p className="text-slate-400">Technical Aptitude</p>
                <span className="text-sm font-mono text-slate-400">
                  {(state.technical * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-slate-600 rounded-full mt-1">
                <div 
                  className={`h-full rounded-full ${hasPassedEvaluation ? 'bg-cyan-400' : 'bg-red-400'}`}
                  style={{ width: `${state.technical * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <p className="text-slate-400">Philosophical Depth</p>
                <span className="text-sm font-mono text-slate-400">
                  {(state.philosophical * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-slate-600 rounded-full mt-1">
                <div 
                  className={`h-full rounded-full ${hasPassedEvaluation ? 'bg-cyan-400' : 'bg-red-400'}`}
                  style={{ width: `${state.philosophical * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <p className="text-slate-400">Creative Thinking</p>
                <span className="text-sm font-mono text-slate-400">
                  {(state.creative * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-slate-600 rounded-full mt-1">
                <div 
                  className={`h-full rounded-full ${hasPassedEvaluation ? 'bg-cyan-400' : 'bg-red-400'}`}
                  style={{ width: `${state.creative * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <p className="text-slate-400">Analytical Skills</p>
                <span className="text-sm font-mono text-slate-400">
                  {(state.analytical * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-slate-600 rounded-full mt-1">
                <div 
                  className={`h-full rounded-full ${hasPassedEvaluation ? 'bg-cyan-400' : 'bg-red-400'}`}
                  style={{ width: `${state.analytical * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={hasPassedEvaluation ? onProceed : onRetry}
        className={`w-full py-3 transition-colors duration-200 font-bold rounded-lg
          ${hasPassedEvaluation 
            ? 'bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-100' 
            : 'bg-slate-700 hover:bg-slate-600 border border-red-400 text-red-100'}`}
      >
        {hasPassedEvaluation ? 'Generate Neural Explorer Profile' : 'Request Another Evaluation Attempt'}
      </button>
    </div>
  );
};

export default DialogueSummary;