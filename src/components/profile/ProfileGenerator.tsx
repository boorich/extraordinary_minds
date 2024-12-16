'use client';

import React, { useState, useEffect } from 'react';
import { DialogueOption } from '@/types/dialogue';
import { Profile } from '@/types/profile';
import Image from 'next/image';

interface ProfileGeneratorProps {
  dialogueChoices: DialogueOption[];
}

interface ImageJob {
  jobId: string;
  status: 'pending' | 'completed' | 'failed';
  statusUrl: string;
  imageUrl?: string;
  error?: string;
}

const ProfileGenerator: React.FC<ProfileGeneratorProps> = ({ dialogueChoices }) => {
  const [name, setName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [imageGenProgress, setImageGenProgress] = useState<string>('');
  const [imageJob, setImageJob] = useState<ImageJob | null>(null);

  // Poll for image status
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    const checkImageStatus = async () => {
      if (!imageJob || imageJob.status !== 'pending') return;

      try {
        const response = await fetch(imageJob.statusUrl);
        if (!response.ok) throw new Error('Failed to check image status');

        const status = await response.json();

        if (status.status === 'completed' && status.imageUrl && profile) {
          // Update profile with the generated image
          const updatedProfile: Profile = {
            ...profile,
            imageUrl: status.imageUrl
          };
          setProfile(updatedProfile);
          setImageJob(prev => prev ? { ...prev, ...status } : null);
          setIsImageGenerating(false);
          setImageGenProgress('Portrait completed!');
        } else if (status.status === 'failed') {
          throw new Error(status.error || 'Image generation failed');
        }
      } catch (err) {
        console.error('Status check error:', err);
        setError('Failed to check image status.');
        setIsImageGenerating(false);
      }
    };

    if (imageJob?.status === 'pending') {
      pollInterval = setInterval(checkImageStatus, 2000); // Poll every 2 seconds
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [imageJob, profile]);

  const calculateProfile = () => {
    const profileMetrics = dialogueChoices.reduce((acc, choice) => {
      acc[choice.type] = (acc[choice.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(profileMetrics).reduce((a, b) => a + b, 0);
    Object.keys(profileMetrics).forEach(key => {
      profileMetrics[key] = Math.round((profileMetrics[key] / total) * 100);
    });

    return profileMetrics;
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
      setImageJob(null);

      // Step 1: Generate initial profile
      const profileResponse = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          choices: dialogueChoices,
        }),
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to generate profile');
      }

      const profileData = await profileResponse.json() as Profile;
      setProfile(profileData);

      // Step 2: Start image generation
      setIsImageGenerating(true);
      setImageGenProgress('Initializing image generation...');

      const imageResponse = await fetch('/api/profile/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: profileData.description,
          profileId: profileData.profileId,
        }),
      });

      if (!imageResponse.ok) {
        throw new Error('Failed to start image generation');
      }

      const jobData = await imageResponse.json();
      setImageJob(jobData);
      setImageGenProgress('Creating your unique portrait...');

    } catch (err) {
      console.error('Profile generation error:', err);
      setError('Failed to generate your profile. The neural winds are unfavorable.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-800/90 rounded-lg border border-cyan-400 p-6 mt-8">
      <h3 className="text-2xl text-cyan-400 pirate-font mb-4">Create Your Neural Explorer Profile</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {!profile ? (
        <>
          <div className="mb-6">
            <label className="block text-cyan-200 mb-2" htmlFor="name">
              Your Name, Explorer
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-700/50 border border-cyan-400/30 rounded p-2 text-white 
                       focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-6">
            <h4 className="text-cyan-200 mb-2">Your Neural Signature</h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(calculateProfile()).map(([type, percentage]) => (
                <div 
                  key={type} 
                  className="bg-slate-700/50 p-3 rounded border border-cyan-400/30"
                >
                  <div className="text-cyan-400 capitalize">{type}</div>
                  <div className="text-white">{percentage}%</div>
                  <div className="mt-2 h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-400 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
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
            {isGenerating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating Profile...
              </div>
            ) : (
              'Generate Neural Explorer Profile'
            )}
          </button>
        </>
      ) : (
        <div className="space-y-6">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-cyan-400">
            {profile.imageUrl ? (
              <Image
                src={profile.imageUrl}
                alt={`${profile.name}'s Neural Explorer Profile`}
                fill
                className="object-cover"
              />
            ) : isImageGenerating ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-700/50">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
                  <p className="text-cyan-400 mt-4">{imageGenProgress || 'Generating your portrait...'}</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-700/50">
                <p className="text-red-400">Failed to generate image</p>
              </div>
            )}
          </div>

          <div className="space-y-4 text-center">
            <h4 className="text-xl text-cyan-400 pirate-font">{profile.name}</h4>
            <p className="text-slate-200">{profile.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
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

          <button
            onClick={() => {
              setProfile(null);
              setName('');
              setError(null);
              setImageJob(null);
            }}
            className="w-full p-3 rounded text-white font-bold water-effect hover:brightness-110 transition-all transform hover:scale-105"
          >
            Generate Another Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileGenerator;