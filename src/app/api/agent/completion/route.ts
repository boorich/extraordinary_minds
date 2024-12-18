import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { model, messages, temperature, max_tokens } = await req.json();
    
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OpenRouter API key missing in environment');
      return NextResponse.json(
        { error: 'Configuration error', details: 'API key not configured' },
        { status: 500 }
      );
    }

    console.log('Starting OpenRouter request:', {
      model,
      messagesCount: messages.length,
      firstMessage: messages[0]?.content?.substring(0, 100),
      temperature,
      max_tokens,
      hasApiKey: !!process.env.OPENROUTER_API_KEY
    });

    const openRouterUrl = 'https://openrouter.ai/api/v1/chat/completions';
    const body = {
      model: model || 'anthropic/claude-instant-v1',
      messages,
      temperature: temperature || 0.7,
      max_tokens: max_tokens || 150,
    };

    console.log('OpenRouter request URL:', openRouterUrl);
    console.log('OpenRouter request body:', JSON.stringify(body, null, 2));

    const response = await fetch(openRouterUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('OpenRouter error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
        headers: Object.fromEntries(response.headers.entries())
      });
      throw new Error(`OpenRouter API call failed: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const data = await response.json();
    console.log('OpenRouter success response:', {
      model: data.model,
      promptTokens: data.usage?.prompt_tokens,
      completionTokens: data.usage?.completion_tokens,
      messageLength: data.choices?.[0]?.message?.content?.length
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Completion error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to generate completion', 
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}