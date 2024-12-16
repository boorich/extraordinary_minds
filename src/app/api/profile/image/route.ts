import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { put } from '@vercel/blob';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function downloadAndStoreImage(url: string, profileId: string): Promise<string> {
  // Download image from DALL-E
  const response = await fetch(url);
  const blob = await response.blob();

  // Upload to Vercel Blob Storage
  const { url: permanentUrl } = await put(`profiles/${profileId}-${Date.now()}.png`, blob, {
    access: 'public',
  });

  return permanentUrl;
}

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
      // Generate image with DALL-E
      const dallEResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: description,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "vivid"
      });

      const dallEUrl = dallEResponse.data[0].url;
      if (!dallEUrl) {
        throw new Error('No image URL received from DALL-E');
      }

      // Store the image and get permanent URL
      const permanentUrl = await downloadAndStoreImage(dallEUrl, profileId);

      // Return the permanent URL
      return NextResponse.json({
        status: 'completed',
        imageUrl: permanentUrl,
        profileId
      });

    } catch (error: any) {
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { 
          status: 'error',
          error: 'Failed to generate image',
          profileId 
        },
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