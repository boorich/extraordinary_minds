import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000, // Extended timeout for image generation
  maxRetries: 3
});

export async function POST(req: Request) {
  const encoder = new TextEncoder();

  try {
    const { description, profileId } = await req.json();

    if (!description || !profileId) {
      return NextResponse.json(
        { error: 'Missing description or profileId' },
        { status: 400 }
      );
    }

    // Create a TransformStream for streaming the response
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Start the image generation in the background
    const imageGeneration = openai.images.generate({
      model: "dall-e-3",
      prompt: description,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "vivid"
    });

    // Send initial status
    await writer.write(encoder.encode(JSON.stringify({
      status: 'started',
      profileId
    }) + '\n'));

    try {
      const response = await imageGeneration;
      
      // Send success response
      await writer.write(encoder.encode(JSON.stringify({
        status: 'completed',
        imageUrl: response.data[0].url,
        profileId
      }) + '\n'));

    } catch (error: any) {
      console.error('OpenAI API error:', error);
      
      // Send error response
      await writer.write(encoder.encode(JSON.stringify({
        status: 'error',
        error: 'Failed to generate profile image',
        profileId
      }) + '\n'));
    }

    await writer.close();

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}