import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { model, messages, temperature, max_tokens } = await req.json();
    
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OpenRouter API key missing');
      throw new Error('OpenRouter API key is not configured');
    }

    console.log('Making OpenRouter request:', {
      model,
      messagesCount: messages.length,
      temperature,
      max_tokens
    });

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
        model: model || 'mistral-7b-instruct',
        messages,
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 150,
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      console.error('OpenRouter API error:', {
        status: response.status,
        statusText: response.statusText,
        error
      });
      throw new Error(`OpenRouter API call failed: ${error.error || response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenRouter response success:', {
      model: data.model,
      messageLength: data.choices?.[0]?.message?.content?.length,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in agent completion:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to generate completion', 
        details: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}