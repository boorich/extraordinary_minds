import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory store for job status (in production, use KV store or database)
const jobStore = new Map<string, {
  status: 'pending' | 'completed' | 'failed';
  imageUrl?: string;
  error?: string;
}>();

export async function POST(req: Request) {
  try {
    const { description, profileId } = await req.json();

    if (!description || !profileId) {
      return NextResponse.json(
        { error: 'Missing description or profileId' },
        { status: 400 }
      );
    }

    // Generate a unique job ID
    const jobId = `${profileId}-${Date.now()}`;
    
    // Store initial job status
    jobStore.set(jobId, { status: 'pending' });

    // Start image generation in the background
    generateImage(description, jobId).catch(console.error);

    // Return immediately with the job ID
    return NextResponse.json({
      jobId,
      status: 'pending',
      statusUrl: `/api/profile/image/status/${jobId}`
    });

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Separate route for checking status
export async function GET(req: Request) {
  try {
    // Extract jobId from URL
    const jobId = req.url.split('/').pop();

    if (!jobId || !jobStore.has(jobId)) {
      return NextResponse.json(
        { error: 'Invalid or expired job ID' },
        { status: 404 }
      );
    }

    const job = jobStore.get(jobId)!;
    
    // Clean up completed/failed jobs after some time
    if (job.status !== 'pending') {
      setTimeout(() => {
        jobStore.delete(jobId);
      }, 5 * 60 * 1000); // Clean up after 5 minutes
    }

    return NextResponse.json(job);

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateImage(description: string, jobId: string) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: description,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "vivid"
    });

    // Update job status with the image URL
    jobStore.set(jobId, {
      status: 'completed',
      imageUrl: response.data[0].url
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    jobStore.set(jobId, {
      status: 'failed',
      error: 'Failed to generate image'
    });
  }
}