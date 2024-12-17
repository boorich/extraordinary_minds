import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { model, messages, temperature, max_tokens } = await req.json();
    
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API key is not configured');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
        'OpenRouter-Completions-Override': JSON.stringify({
          temperature: temperature || 0.7,
          max_tokens: max_tokens || 150
        })
      },
      body: JSON.stringify({
        model: model || 'mistral-7b-instruct',  // Default to Mistral if not specified
        messages
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      console.error('OpenRouter API error:', error);
      throw new Error(`OpenRouter API call failed: ${error.error || response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    // Convert unknown error to string message
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred';
    
    console.error('Error in agent completion:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate completion', 
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}