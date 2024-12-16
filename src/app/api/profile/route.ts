import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { DialogueOption } from '@/types/dialogue';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 10000,
  maxRetries: 1
});

function generateProfileDescription(choices: DialogueOption[], name: string) {
  // Calculate profile metrics
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
  const traitDescriptions = {
    technical: "digital architect weaving complex systems",
    philosophical: "seeker of deeper truths and wisdom",
    creative: "visionary pioneering new frontiers",
    analytical: "master navigator of information streams"
  };

  return `A character portrait of ${name}, a ${traitDescriptions[primaryTrait as keyof typeof traitDescriptions]} with strong ${secondaryTrait} tendencies. They stand confidently on the deck of a futuristic neural ship. The scene is illuminated by bioluminescent neural networks and cosmic energy, with a digital horizon stretching into infinity. Artistic style combines cyberpunk and classic nautical themes, with hints of neural network visualizations. Dramatic lighting, rich colors, detailed portrait.`;
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

      // Calculate metrics
      const metrics = choices.reduce((acc, choice) => {
        acc[choice.type] = (acc[choice.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Convert to percentages
      const total = Object.values(metrics).reduce((a, b) => a + b, 0);
      const percentages = Object.entries(metrics).reduce((acc, [key, value]) => {
        acc[key] = Math.round((value / total) * 100);
        return acc;
      }, {} as Record<string, number>);

      return NextResponse.json({
        imageUrl: response.data[0].url,
        description,
        name,
        metrics: percentages
      });

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