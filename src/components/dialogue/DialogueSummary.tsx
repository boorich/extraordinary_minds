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
  const averageScore = conversations.reduce((acc, conv) => acc + conv.score, 0) / conversations.length;

  // Safely access metrics with defaults
  const metrics = {
    understanding: state.understanding || 0,
    potential: state.potential || 0,
    readiness: state.readiness || 0,
    investment: state.investment || 0
  };

  return (
    <div className="bg-slate-800/90 rounded-lg border border-cyan-400 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-3 w-3 bg-cyan-400 rounded-full animate-pulse" />
          <h3 className="text-cyan-400 text-xl font-bold">
            MCP Assessment Complete
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Compatibility Score:</span>
          <span className="text-cyan-400 font-mono">
            {(averageScore * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-700/50 rounded p-4 border border-cyan-400/30">
          <h4 className="text-cyan-300 mb-2">Conversation Analysis</h4>
          <div className="space-y-3">
            {conversations.map((conv, index) => (
              <div key={index} className="space-y-2 p-3 bg-slate-800/50 rounded">
                <div className="flex justify-between items-center">
                  <p className="text-slate-400 text-sm font-medium">Topic {index + 1}</p>
                  <span className="text-sm font-mono text-cyan-400">
                    {(conv.score * 100).toFixed(1)}% alignment
                  </span>
                </div>
                <p className="text-slate-400 text-sm italic">{conv.question}</p>
                <p className="text-slate-200">{conv.response}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-700/50 rounded p-4 border border-cyan-400/30">
          <h4 className="text-cyan-300 mb-2">Integration Potential Analysis</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between">
                <p className="text-slate-400">MCP Understanding</p>
                <span className="text-sm font-mono text-slate-400">
                  {(metrics.understanding * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-slate-600 rounded-full mt-1">
                <div 
                  className="h-full rounded-full bg-cyan-400"
                  style={{ width: `${metrics.understanding * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <p className="text-slate-400">Business Potential</p>
                <span className="text-sm font-mono text-slate-400">
                  {(metrics.potential * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-slate-600 rounded-full mt-1">
                <div 
                  className="h-full rounded-full bg-cyan-400"
                  style={{ width: `${metrics.potential * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <p className="text-slate-400">Implementation Readiness</p>
                <span className="text-sm font-mono text-slate-400">
                  {(metrics.readiness * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-slate-600 rounded-full mt-1">
                <div 
                  className="h-full rounded-full bg-cyan-400"
                  style={{ width: `${metrics.readiness * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <p className="text-slate-400">Investment Alignment</p>
                <span className="text-sm font-mono text-slate-400">
                  {(metrics.investment * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-slate-600 rounded-full mt-1">
                <div 
                  className="h-full rounded-full bg-cyan-400"
                  style={{ width: `${metrics.investment * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onProceed}
        className="w-full py-3 transition-colors duration-200 font-bold rounded-lg
          bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-100"
      >
        Schedule MCP Integration Consultation
      </button>
    </div>
  );
};

export default DialogueSummary;