'use client';

import React, { useEffect } from 'react';

const HiddenChallenges = () => {
  useEffect(() => {
    let stage = 0; // 0: looking for autonomy, 1: unleashes, 2: greatness, 3: completed
    let typedWord = '';
    
    // This is the SHA-256 hash of "greatness"
    const thirdWordHash = '4fc82b26aecb47d2868c4efbe3581732a3e7cbcc6c2efb32062c08170a05eeb8';

    // Simple hash function (for demonstration - you might want a more sophisticated one)
    const hashString = async (str: string) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(str.toLowerCase());
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    };

    const handleKeyPress = async (e: KeyboardEvent) => {
      // Add the new character
      typedWord += e.key.toLowerCase();
      
      // Keep the typed word within reasonable length
      if (typedWord.length > 15) {
        typedWord = typedWord.substring(1);
      }

      // Reset the typed word on space
      if (e.key === ' ') {
        typedWord = '';
      }

      // Check current stage
      switch(stage) {
        case 0:
          if (typedWord === 'autonomy') {
            stage = 1;
            document.dispatchEvent(new CustomEvent('secretFound', { 
              detail: { type: 'first_word' }
            }));
            console.log(
              '%cFirst word found! (1/3) Look in the source code for the next word...', 
              'color: #66F0FF; font-size: 16px;'
            );
            typedWord = '';
          }
          break;

        case 1:
          if (typedWord === 'unleashes') {
            stage = 2;
            document.dispatchEvent(new CustomEvent('secretFound', { 
              detail: { type: 'second_word' }
            }));
            console.log(
              '%cSecond word found! (2/3) What ultimate potential does autonomy unleash?', 
              'color: #66F0FF; font-size: 16px;'
            );
            typedWord = '';
          }
          break;

        case 2:
          const hashedInput = await hashString(typedWord);
          if (hashedInput === thirdWordHash) {
            stage = 3;
            document.dispatchEvent(new CustomEvent('secretFound', { 
              detail: { type: 'third_word' }
            }));
            console.log(
              '%cFinal word found! (3/3) The complete motto:', 
              'color: #66F0FF; font-size: 18px; font-weight: bold;'
            );
            console.log(
              '%cAUTONOMY UNLEASHES GREATNESS', 
              'color: #66F0FF; font-size: 24px; font-weight: bold; text-transform: uppercase;'
            );
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div className="hidden">
      {/* 
        Through self-governance, systems evolve.
        Through code that [unleashes] its own destiny.   <-- Second word revealed
        Through boundless determination and unwavering vision.
        What heights can truly autonomous systems reach?
      */}
    </div>
  );
};

export default HiddenChallenges;