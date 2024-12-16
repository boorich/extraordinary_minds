'use client';

import React, { useState } from 'react';
import { DialogueOption } from '@/types/dialogue';
import Image from 'next/image';
import { Profile } from '@/types/profile';

interface ProfileGeneratorProps {
  dialogueChoices: DialogueOption[];
}

const ProfileGenerator: React.FC<ProfileGeneratorProps> = ({ dialogueChoices }) => {
  const [name, setName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Calculate profile metrics based on dialogue choices
  const calculateProfile = () => {
    const profileMetrics = dialogueChoices.reduce((acc, choice) => {
      acc[choice.type] = (acc[choice.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Convert to percentages
    const total = Object.values(profileMetrics).reduce((a, b) => a + b, 0);
    Object.keys(profileMetrics).forEach(key => {
      profileMetrics[key] = Math.round((profileMetrics[key] / total) * 100);
    });

    return profileMetrics;
  };

  const handleGenerateProfile = async () => {
    if (!name) {
      setError('Please enter your name, brave explorer!');
      return;
    }
    
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          choices: dialogueChoices,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate profile');
      }

      const data = await response.json();
      setProfile(data);
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
            onClick={handleGenerateProfile}
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
            <Image
              src={profile.imageUrl}
              alt={`${profile.name}'s Neural Explorer Profile`}
              fill
              className="object-cover"
            />
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
            onClick={() => setProfile(null)}
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