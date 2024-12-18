'use client';

import React, { useState, useEffect } from 'react';
import { DialogueOption } from '@/types/dialogue';
import { Profile } from '@/types/profile';
import Image from 'next/image';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ProfileGeneratorProps {
  dialogueChoices: DialogueOption[];
  generationPrompt: string;
  explorerName?: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const MAX_IMAGE_REGENERATIONS = 2;

const ProfileGenerator: React.FC<ProfileGeneratorProps> = ({ dialogueChoices, generationPrompt, explorerName = '' }) => {
  const [name, setName] = useState(explorerName);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [imageGenProgress, setImageGenProgress] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [regenerationsLeft, setRegenerationsLeft] = useState(MAX_IMAGE_REGENERATIONS);
  const [showImageControls, setShowImageControls] = useState(false);

  useEffect(() => {
    if (explorerName) {
      setName(explorerName);
    }
  }, [explorerName]);

  const generateImage = async (description: string, profileId: string): Promise<string> => {
    const response = await fetch('/api/profile/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description,
        profileId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate image');
    }

    const data = await response.json();
    
    if (data.status === 'error') {
      throw new Error(data.error || 'Image generation failed');
    }

    return data.imageUrl;
  };

  const handleRegenerateImage = async () => {
    if (regenerationsLeft <= 0 || !profile) return;
    
    setRegenerationsLeft(prev => prev - 1);
    setShowImageControls(false);
    setIsImageGenerating(true);
    setImageGenProgress('Regenerating your portrait...');

    try {
      const imageUrl = await generateImage(generationPrompt, profile.profileId);
      setProfile(prev => prev ? { ...prev, imageUrl } : null);
      setShowImageControls(true);
    } catch (err) {
      console.error('Failed to regenerate image:', err);
      setError('Failed to regenerate portrait. Please try again.');
    } finally {
      setIsImageGenerating(false);
    }
  };

  const handleAcceptImage = () => {
    setShowImageControls(false);
  };

  const handleGenerateClick = async () => {
    if (!name) {
      setError('Please enter your name, brave explorer!');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      setImageGenProgress('');
      setRetryCount(0);
      setIsTransitioning(true);
      setRegenerationsLeft(MAX_IMAGE_REGENERATIONS);

      const profileResponse = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          choices: dialogueChoices,
          generationPrompt
        }),
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to generate profile');
      }

      const profileData = await profileResponse.json() as Profile;
      setProfile(profileData);

      setIsImageGenerating(true);
      setImageGenProgress('Creating your unique portrait...');

      let lastError: Error | null = null;
      
      for (let i = 0; i < MAX_RETRIES; i++) {
        try {
          const imageUrl = await generateImage(generationPrompt, profileData.profileId);
          
          const updatedProfile: Profile = {
            ...profileData,
            imageUrl
          };
          setProfile(updatedProfile);
          setImageGenProgress('Portrait completed!');
          setShowImageControls(true);
          return;
          
        } catch (err) {
          lastError = err as Error;
          setRetryCount(i + 1);
          
          if (i < MAX_RETRIES - 1) {
            setImageGenProgress(`Retrying image generation (${i + 1}/${MAX_RETRIES})...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          }
        }
      }

      throw lastError || new Error('Failed to generate image after all retries');

    } catch (err) {
      console.error('Profile generation error:', err);
      setError('Failed to generate your profile. The neural winds are unfavorable.');
    } finally {
      setIsGenerating(false);
      setIsImageGenerating(false);
      setImageGenProgress('');
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  return (
    <div className="bg-slate-800/90 rounded-lg border border-cyan-400 p-4 sm:p-6 mt-8">
      <h3 className="text-xl sm:text-2xl text-cyan-400 pirate-font mb-4">Create Your Neural Explorer Profile</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
          {error}
        </div>
      )}

      <div className="relative min-h-[400px]">
        <div className={`absolute inset-0 transition-all duration-500 ${isTransitioning ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          <div className="mb-6">
            <label className="block text-cyan-200 mb-2" htmlFor="name">
              Your Name, Explorer
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-700/50 border border-cyan-400/30 rounded p-2 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              placeholder={explorerName || "Enter your name"}
              disabled={isGenerating}
            />
          </div>

          <button
            onClick={handleGenerateClick}
            disabled={!name || isGenerating}
            className={`w-full p-3 rounded text-white font-bold
                     ${!name || isGenerating 
                       ? 'bg-slate-600 cursor-not-allowed' 
                       : 'water-effect hover:brightness-110 transition-all transform hover:scale-105'
                     }`}
          >
            Generate Neural Explorer Profile
          </button>
        </div>

        {(isGenerating || profile) && (
          <div className={`absolute inset-0 transition-all duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <div className="space-y-6">
              <div className="max-w-md mx-auto w-full">
                <div className="relative w-full pb-[100%] rounded-lg overflow-hidden border-2 border-cyan-400">
                  {profile?.imageUrl ? (
                    <>
                      <Image
                        src={profile.imageUrl}
                        alt={`${profile.name}'s Neural Explorer Profile`}
                        fill
                        className="object-contain"
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {showImageControls && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-8">
                          <button
                            onClick={handleAcceptImage}
                            className="p-3 rounded-full hover:bg-green-500/20 transition-colors"
                            aria-label="Accept image"
                          >
                            <CheckCircle2 className="w-12 h-12 text-green-400" />
                          </button>
                          {regenerationsLeft > 0 && (
                            <button
                              onClick={handleRegenerateImage}
                              className="p-3 rounded-full hover:bg-red-500/20 transition-colors"
                              aria-label="Regenerate image"
                            >
                              <XCircle className="w-12 h-12 text-red-400" />
                            </button>
                          )}
                        </div>
                      )}
                    </>
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
                {regenerationsLeft < MAX_IMAGE_REGENERATIONS && (
                  <div className="text-center mt-2 text-cyan-400/70 text-sm">
                    {regenerationsLeft} regeneration{regenerationsLeft !== 1 ? 's' : ''} remaining
                  </div>
                )}
              </div>

              {profile ? (
                <>
                  <div className="space-y-4 text-center max-w-2xl mx-auto">
                    <h4 className="text-lg sm:text-xl text-cyan-400 pirate-font">{profile.name}</h4>
                    <p className="text-slate-200 text-sm sm:text-base">{profile.description}</p>
                  </div>
                  
                  {profile.metrics && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
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
                  )}
                </>
              ) : (
                <div className="space-y-6 animate-pulse">
                  <div className="space-y-4 text-center">
                    <div className="h-6 bg-slate-600/50 rounded w-1/3 mx-auto"></div>
                    <div className="h-20 bg-slate-600/50 rounded"></div>
                  </div>
                </div>
              )}

              {profile && (
                <div className="max-w-md mx-auto">
                  <button
                    onClick={() => {
                      setProfile(null);
                      setName(explorerName || '');
                      setError(null);
                      setRegenerationsLeft(MAX_IMAGE_REGENERATIONS);
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