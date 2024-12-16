import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // Longer timeout for image generation
  maxRetries: 2
});

export async function POST(req: Request) {
  try {
    const { description, profileId } = await req.json();

    if (!description || !profileId) {
      return NextResponse.json(
        { error: 'Missing description or profileId' },
        { status: 400 }
      );
    }

    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: description,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "vivid"
      });

      return NextResponse.json({
        imageUrl: response.data[0].url,
        profileId
      });

    } catch (error: any) {
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: 'Failed to generate profile image', profileId },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}