import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { put } from '@vercel/blob';

export const runtime = 'edge';
export const maxDuration = 60; // Set maximum duration to 60 seconds

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function downloadAndStoreImage(url: string, profileId: string): Promise<string> {
  try {
    console.log('Downloading image from DALL-E:', url);
    
    // Download image from DALL-E
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    console.log('Image downloaded, size:', blob.size);

    // Upload to Vercel Blob Storage
    console.log('Uploading to Vercel Blob Storage...');
    const { url: permanentUrl } = await put(`profiles/${profileId}-${Date.now()}.png`, blob, {
      access: 'public',
      contentType: 'image/png',
    });

    console.log('Upload successful:', permanentUrl);
    return permanentUrl;

  } catch (error) {
    console.error('Error in downloadAndStoreImage:', error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    console.log('Starting image generation process...');
    
    const { description, profileId } = await req.json();

    if (!description || !profileId) {
      return NextResponse.json(
        { error: 'Missing description or profileId' },
        { status: 400 }
      );
    }

    try {
      // Generate image with DALL-E
      console.log('Calling DALL-E API...');
      const dallEResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: description,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "vivid",
        response_format: 'url'
      });

      console.log('DALL-E response received:', dallEResponse);

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
      // Include more detailed error information
      return NextResponse.json(
        { 
          status: 'error',
          error: `Failed to generate image: ${error.message}`,
          details: error.toString(),
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