'use client';

import React, { useState } from 'react';
import { DialogueOption } from '@/types/dialogue';
import { Profile } from '@/types/profile';
import Image from 'next/image';

// ... (keep all the interfaces and imports)

const ProfileGenerator: React.FC<ProfileGeneratorProps> = ({ dialogueChoices }) => {
  // ... (keep all the state and function declarations)

  return (
    <div className="bg-slate-800/90 rounded-lg border border-cyan-400 p-4 sm:p-6 mt-8">
      <h3 className="text-xl sm:text-2xl text-cyan-400 pirate-font mb-4">Create Your Neural Explorer Profile</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
          {error}
        </div>
      )}

      <div className="relative min-h-[400px]">
        {/* Input Form Layer */}
        <div className={`absolute inset-0 transition-all duration-500 ${isTransitioning ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          {/* ... (keep the input form content) */}
        </div>

        {/* Generated Profile Layer */}
        {(isGenerating || profile) && (
          <div className={`absolute inset-0 transition-all duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <div className="space-y-6">
              {/* Image Container - Responsive sizing */}
              <div className="max-w-md mx-auto w-full"> {/* Add max width and center */}
                <div className="relative w-full pb-[100%] rounded-lg overflow-hidden border-2 border-cyan-400">
                  {profile?.imageUrl ? (
                    <Image
                      src={profile.imageUrl}
                      alt={`${profile.name}'s Neural Explorer Profile`}
                      fill
                      className="object-contain" // Change to contain for better fitting
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Add sizes for responsive loading
                    />
                  ) : isImageGenerating ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-700/50">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
                        <p className="text-cyan-400 mt-4 text-center px-4">
                          {imageGenProgress || 'Generating your portrait...'}
                          {retryCount > 0 && <span className="block text-sm mt-1">Attempt {retryCount}/{MAX_RETRIES}</span>}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-700/50">
                      <div className="animate-pulse flex space-x-4">
                        <div className="bg-slate-600/50 h-full w-full"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {profile ? (
                <>
                  <div className="space-y-4 text-center max-w-2xl mx-auto"> {/* Add max width and center */}
                    <h4 className="text-lg sm:text-xl text-cyan-400 pirate-font">{profile.name}</h4>
                    <p className="text-slate-200 text-sm sm:text-base">{profile.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto"> {/* Make grid responsive */}
                    {Object.entries(profile.metrics).map(([type, value]) => (
                      <div 
                        key={type} 
                        className="bg-slate-700/50 p-3 rounded border border-cyan-400/30"
                      >
                        <div className="text-cyan-400 capitalize">{type}</div>
                        <div className="text-white">{value}%</div>
                        <div className="mt-2 h-2 bg-slate-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-cyan-400 transition-all duration-500"
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-6 animate-pulse">
                  {/* ... (keep the loading state content) */}
                </div>
              )}

              {profile && (
                <div className="max-w-md mx-auto"> {/* Center the button */}
                  <button
                    onClick={() => {
                      setProfile(null);
                      setName('');
                      setError(null);
                    }}
                    className="w-full p-3 rounded text-white font-bold water-effect hover:brightness-110 transition-all transform hover:scale-105"
                  >
                    Generate Another Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileGenerator;