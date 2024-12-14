'use client';

import React, { useEffect, useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

interface RiddleSuccessProps {
  secretsFound: string[];
}

const RiddleSuccess: React.FC<RiddleSuccessProps> = ({ secretsFound }) => {
  const [uniqueId, setUniqueId] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (secretsFound.length === 3) {
      setIsVisible(true);
      const timestamp = Date.now().toString(36);
      const randomStr = Math.random().toString(36).substring(2, 7);
      setUniqueId(`${timestamp}${randomStr}`);
    }
  }, [secretsFound]);

  const handleCopy = async () => {
    const identifier = `autonomy.${uniqueId}@vision`;
    await navigator.clipboard.writeText(identifier);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (secretsFound.length < 3 || !isVisible) {
    return secretsFound.length > 0 ? (
      <div 
        className="fixed bottom-4 right-4 text-cyan-400 text-sm animate-fade-in"
        role="status"
        aria-live="polite"
      >
        Discoveries: {secretsFound.length}/3
      </div>
    ) : null;
  }

  return (
    <div 
      className="fixed bottom-4 right-4 bg-slate-800/90 p-4 rounded-lg border border-cyan-400 backdrop-blur-sm animate-fade-in max-w-md"
      role="status"
      aria-live="polite"
    >
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-slate-400 hover:text-cyan-400 transition-colors"
        aria-label="Close success message"
      >
        <X size={16} />
      </button>
      <div className="text-cyan-400 font-bold mb-2">Access Granted</div>
      <div className="text-slate-200 text-sm mb-3">
        Welcome, Reality Hacker. Your unique identifier has been generated.
      </div>
      <div className="bg-slate-900/50 p-2 rounded border border-cyan-400/50 font-mono text-xs text-cyan-300 break-all relative group">
        autonomy.{uniqueId}@vision
        <button
          onClick={handleCopy}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Copy identifier"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <div className="mt-2 text-xs text-slate-400">
        Share this identifier to verify your achievement.
      </div>
    </div>
  );
};

export default RiddleSuccess;