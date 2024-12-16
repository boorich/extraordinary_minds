'use client';

import React, { useState } from 'react';
import { DialogueOption } from '@/types/dialogue';
import { Profile } from '@/types/profile';
import Image from 'next/image';

interface ProfileGeneratorProps {
  dialogueChoices: DialogueOption[];
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const ProfileGenerator: React.FC<ProfileGeneratorProps> = ({ dialogueChoices }) => {
  // ... (previous state declarations remain the same)

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

    // The imageUrl is now a local path
    return data.imageUrl;
  };

  // ... (rest of the component remains the same)

  return (
    // ... (previous JSX remains the same until the image section)
    <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-cyan-400">
      {profile.imageUrl ? (
        <Image
          src={profile.imageUrl}
          alt={`${profile.name}'s Neural Explorer Profile`}
          fill
          className="object-cover"
          // Add unoptimized prop to skip Next.js image optimization
          unoptimized
        />
      ) : isImageGenerating ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-700/50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            <p className="text-cyan-400 mt-4">
              {imageGenProgress || 'Generating your portrait...'}
              {retryCount > 0 && <span className="block text-sm mt-1">Attempt {retryCount}/{MAX_RETRIES}</span>}
            </p>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-700/50">
          <p className="text-red-400">Failed to generate image</p>
        </div>
      )}
    </div>
    // ... (rest of the JSX remains the same)
  );
};

export default ProfileGenerator;