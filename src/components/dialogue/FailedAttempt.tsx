import React from 'react';

interface FailedAttemptProps {
  reason: string;
  onRetry: () => void;
}

const FailedAttempt: React.FC<FailedAttemptProps> = ({ reason, onRetry }) => {
  return (
    <div className="bg-red-900/20 rounded-lg border border-red-500 p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center space-x-3">
        <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" />
        <h3 className="text-red-500 text-xl font-bold">Evaluation Failed</h3>
      </div>
      
      <div className="bg-slate-800/50 p-4 rounded border border-red-500/30">
        <p className="text-slate-200 mb-2">
          "I regret to inform you that you have not met the requirements to join this vessel's crew."
        </p>
        <p className="text-red-400 font-mono">
          Reason: {reason}
        </p>
      </div>

      <div className="pt-4">
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500 
                   rounded-lg text-red-100 transition-colors duration-200"
        >
          Request Another Attempt
        </button>
      </div>
    </div>
  );
};

export default FailedAttempt;