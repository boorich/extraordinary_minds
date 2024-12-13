'use client';

import React, { useEffect, useState } from 'react';

const CryptoPuzzle = () => {
  const [solved, setSolved] = useState(false);
  
  // SHA-256 hash of the solution
  const targetHash = '8c9c0c7c960c91d8893d7b6279019b238c990c2b5777c03d55af6c689953d0f1';
  
  useEffect(() => {
    // Add a comment in the HTML source with a clue
    const clue = document.createComment(
      `Key insight: The answer lies in the binary patterns of autonomous systems.
       First 8 bits: 10101010
       Hint: Quantum superposition states in binary`
    );
    document.head.appendChild(clue);
    
    // Expose a special function in the console that shows the hash for debugging
    (window as any).validateQuantumState = async (input: string) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      console.log('Input:', input);
      console.log('Generated hash:', hashHex);
      console.log('Target hash:   ', targetHash);
      console.log('Match?', hashHex === targetHash);
      
      if (hashHex === targetHash) {
        setSolved(true);
        dispatchSecretFound('cryptographic');
        console.log('Quantum state verified. Welcome, pioneer.');
        return true;
      }
      return false;
    };
    
    // Helper function to generate hash for any string
    (window as any).generateHash = async (input: string) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      console.log('Input:', input);
      console.log('Hash:', hashHex);
      return hashHex;
    };
    
    (window as any).checkQuantumState = async () => {
      const response = await fetch('/api/quantum-state');
      const secretHeader = response.headers.get('X-Quantum-State');
      if (secretHeader === 'superposition-achieved') {
        dispatchSecretFound('quantum');
        return true;
      }
      return false;
    };
  }, []);
  
  const dispatchSecretFound = (type: string) => {
    const event = new CustomEvent('secretFound', {
      detail: { type }
    });
    document.dispatchEvent(event);
  };
  
  return (
    <div className="fixed bottom-4 left-4 opacity-50 hover:opacity-100 transition-opacity">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={solved ? '#4ade80' : '#22d3ee'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transform: solved ? 'rotate(180deg)' : undefined }}
        className="transition-transform duration-500"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    </div>
  );
};

export default CryptoPuzzle;