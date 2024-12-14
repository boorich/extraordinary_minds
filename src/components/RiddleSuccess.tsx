'use client';

import React, { useEffect, useState } from 'react';

interface RiddleSuccessProps {
  secretsFound: string[];
}

const RiddleSuccess: React.FC<RiddleSuccessProps> = ({ secretsFound }) => {
  const [uniqueId, setUniqueId] = useState('');

  useEffect(() => {
    if (secretsFound.length === 3) {
      // Generate a unique identifier based on timestamp and random elements
      const timestamp = Date.now().toString(36);
      const randomStr = Math.random().toString(36).substring(2, 7);
      setUniqueId(`${timestamp}${randomStr}`);
    }
  }, [secretsFound]);

  if (secretsFound.length < 3) {
    return (
      <div 
        className="fixed bottom-4 right-4 text-cyan-400 text-sm animate-fade-in"
        role="status"
        aria-live="polite"
      >
        Discoveries: {secretsFound.length}/3
      </div>
    );
  }

  return (
    <div 
      className="fixed bottom-4 right-4 bg-slate-800/90 p-4 rounded-lg border border-cyan-400 backdrop-blur-sm animate-fade-in max-w-md"
      role="status"
      aria-live="polite"
    >
      <div className="text-cyan-400 font-bold mb-2">Access Granted</div>
      <div className="text-slate-200 text-sm mb-3">
        Welcome, Reality Hacker. Your unique identifier has been generated.
      </div>
      <div className="bg-slate-900/50 p-2 rounded border border-cyan-400/50 font-mono text-xs text-cyan-300 break-all">
        autonomy.{uniqueId}@vision
      </div>
      <div className="mt-2 text-xs text-slate-400">
        Share this identifier to verify your achievement.
      </div>
    </div>
  );
};

export default RiddleSuccess;