import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { DialogueOption } from '@/types/dialogue';
import { Profile, ProfileMetrics } from '@/types/profile';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 10000,
  maxRetries: 1
});

function generateProfileDescription(choices: DialogueOption[], name: string) {
  // Calculate profile metrics with proper typing
  const metrics = choices.reduce((acc, choice) => {
    acc[choice.type] = (acc[choice.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get dominant traits
  const sortedTraits = Object.entries(metrics)
    .sort(([,a], [,b]) => b - a)
    .map(([type]) => type);

  const primaryTrait = sortedTraits[0];
  const secondaryTrait = sortedTraits[1];

  // Generate profile text based on traits
  const traitDescriptions: Record<string, string> = {
    technical: "digital architect weaving complex systems",
    philosophical: "seeker of deeper truths and wisdom",
    creative: "visionary pioneering new frontiers",
    analytical: "master navigator of information streams"
  };

  return `A character portrait of ${name}, a ${traitDescriptions[primaryTrait]} with strong ${secondaryTrait} tendencies. They stand confidently on the deck of a futuristic neural ship. The scene is illuminated by bioluminescent neural networks and cosmic energy, with a digital horizon stretching into infinity. Artistic style combines cyberpunk and classic nautical themes, with hints of neural network visualizations. Dramatic lighting, rich colors, detailed portrait.`;
}

function calculateMetrics(choices: DialogueOption[]): ProfileMetrics {
  // Initialize metrics object with proper typing
  const counts = choices.reduce((acc, choice) => {
    acc[choice.type] = (acc[choice.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate total responses
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

  // Convert to percentages with proper typing
  return {
    technical: Math.round(((counts.technical || 0) / total) * 100),
    philosophical: Math.round(((counts.philosophical || 0) / total) * 100),
    creative: Math.round(((counts.creative || 0) / total) * 100),
    analytical: Math.round(((counts.analytical || 0) / total) * 100),
  };
}

export async function POST(req: Request) {
  try {
    const { name, choices } = await req.json();

    if (!name || !choices || !Array.isArray(choices)) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    // Generate profile description
    const description = generateProfileDescription(choices, name);

    // Request image generation
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: description,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "vivid"
      });

      // Calculate profile metrics
      const metrics = calculateMetrics(choices);

      const profile: Profile = {
        name,
        imageUrl: response.data[0].url || '',
        description,
        metrics
      };

      return NextResponse.json(profile);

    } catch (error: any) {
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: 'Failed to generate profile image' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Profile generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}